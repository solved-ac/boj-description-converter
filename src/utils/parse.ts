import { latexParser as lp } from "latex-utensils";
import {
  AstRoot,
  Node
} from "latex-utensils/out/types/src/latex/latex_parser_types";
import { TransformerArgs } from "./helpers";
import { stringify } from "./stringify";
import commonCommandTransformers from "./transform/command";
import textEnvTransformers from "./transform/environment";
import transformMathAlign from "./transform/kinds/mathAlign";
import mathCommandTransformers, {
  mathCommandOperators
} from "./transform/mathCommand";
import mathKindTransformers, { mathOperators } from "./transform/mathKind";
import commandTransformers, { unsupported } from "./transform/textCommand";

export const regularizeText = (s: string) =>
  s
    .replace(/``/g, "&ldquo;")
    .replace(/''/g, "&rdquo;")
    .replace(/"/g, "&rdquo;")
    .replace(/&quot;/g, "&rdquo;")
    .replace(/`/g, "&lsquo;")
    .replace(/'/g, "&rsquo;");

export const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const parse = (s: string): AstRoot | string => {
  try {
    return lp.parse(s, { startRule: "Root" }) as AstRoot;
  } catch (e) {
    return s;
  }
};

export const isMathOperator = (s: Node) => {
  if (s.kind === "math.character") {
    return mathOperators.includes(s.content);
  }
  if (s.kind === "command") {
    return mathCommandOperators.includes(s.name);
  }
  return false;
};

export const isMathBigOperator = (s: Node) => {
  if (s.kind === "command") {
    return s.name === "sum";
  }
  return false;
};

export const transformMathNodeArray = (
  s: Node[],
  args: TransformerArgs
): string => {
  let ret = "";

  const len = s.length;
  for (let i = 0; i < len; i++) {
    const cur = s[i];
    if (i + 1 < len && isMathBigOperator(cur)) {
      const nxt1 = s[i + 1];
      if (nxt1.kind === "superscript") {
        if (i + 2 < len) {
          const nxt2 = s[i + 2];
          if (nxt2.kind === "subscript") {
            ret += `<span style="display:inline-flex;flex-direction:column;text-align:center;vertical-align:middle;"><small style="margin-bottom:-0.4em;">${
              nxt1.arg ? transformMathNode(nxt1.arg, args) : "&nbsp;"
            }</small><span>${transformMathNode(
              cur,
              args
            )}</span><small style="margin-top:-0.4em;">${
              nxt2.arg ? transformMathNode(nxt2.arg, args) : "&nbsp;"
            }</small></span>&nbsp;`;
            i += 2;
            continue;
          }
        }
        ret += `<span style="display:inline-flex;flex-direction:column;text-align:center;vertical-align:middle;"><small style="margin-bottom:-0.4em;">${
          nxt1.arg ? transformMathNode(nxt1.arg, args) : "&nbsp;"
        }</small><span>${transformMathNode(
          cur,
          args
        )}</span><small style="margin-top:-0.4em;">&nbsp;</small></span>&nbsp;`;
        i += 1;
        continue;
      }
      if (nxt1.kind === "subscript") {
        if (i + 2 < len) {
          const nxt2 = s[i + 2];
          if (nxt2.kind === "superscript") {
            ret += `<span style="display:inline-flex;flex-direction:column;text-align:center;vertical-align:middle;"><small style="margin-bottom:-0.4em;">${
              nxt2.arg ? transformMathNode(nxt2.arg, args) : "&nbsp;"
            }</small><span>${transformMathNode(
              cur,
              args
            )}</span><small style="margin-top:-0.4em;">${
              nxt1.arg ? transformMathNode(nxt1.arg, args) : "&nbsp;"
            }</small></span>&nbsp;`;
            i += 2;
            continue;
          }
        }
        ret += `<span style="display:inline-flex;flex-direction:column;text-align:center;vertical-align:middle;"><small style="margin-bottom:-0.4em;">&nbsp;</small><span>${transformMathNode(
          cur,
          args
        )}</span><small style="margin-top:-0.4em;">${
          nxt1.arg ? transformMathNode(nxt1.arg, args) : "&nbsp;"
        }</small></span>&nbsp;`;
        i += 1;
        continue;
      }
    }
    ret += transformMathNode(cur, args);
    if (i + 1 < len && (isMathOperator(cur) || isMathOperator(s[i + 1]))) {
      if (
        cur.kind === "math.character" &&
        (cur.content === "-" || cur.content === "+")
      ) {
        if (!i) continue;
        if (isMathOperator(s[i - 1])) continue;
      }
      ret += " ";
      continue;
    }
    if (i + 1 < len && cur.kind === "math.character") {
      if (cur.content === ",") ret += " ";
    }
  }
  return ret;
};

export const transformMathNode = (
  s: Node | Node[],
  args: TransformerArgs
): string => {
  if (Array.isArray(s)) return transformMathNodeArray(s, args);
  if (s.kind === "arg.group") return transformMathNode(s.content, args);

  if (Object.keys(mathKindTransformers).includes(s.kind))
    return mathKindTransformers[s.kind as keyof typeof mathKindTransformers](
      s,
      args
    );

  if (s.kind === "command") {
    if (Object.keys(commonCommandTransformers).includes(s.name))
      return commonCommandTransformers[
        s.name as keyof typeof commonCommandTransformers
      ](s, args);
    if (Object.keys(mathCommandTransformers).includes(s.name))
      return mathCommandTransformers[
        s.name as keyof typeof mathCommandTransformers
      ](s, args);
  }

  return unsupported(JSON.stringify(s));
};

const paragraphEnvs = ["center", "figure", "itemize", "enumerate"];
const paragraphKinds = ["env.math.align"];
const paragraphBreakCommands = [
  "InputFile",
  "OutputFile",
  "Interaction",
  "Note",
  "Notes",
  "Constraints",
  "Examples",
];

export const transformNodeArray = (
  s: Node[],
  args: TransformerArgs
): string => {
  const { renderMath } = args;
  let ret = "";

  const len = s.length;
  const open = new Map<string, boolean>();

  for (let i = 0; i < len; i++) {
    const cur = s[i];
    if (lp.isEnvironment(cur)) {
      if (paragraphEnvs.includes(cur.name)) {
        if (open.get("parbreak")) ret += "</p>";
        ret += transformNode(cur, args);
        open.set("parbreak", false);
        continue;
      }
    }
    if (cur.kind === "env.math.align") {
      if (open.get("parbreak")) ret += "</p>";
      if (!renderMath) {
        ret += transformNode(
          { kind: "displayMath", content: [cur], location: cur.location },
          { ...args, italicMath: true }
        );
      } else {
        ret += '<p style="text-align:center;">';
        ret += transformMathAlign(cur, { ...args, italicMath: true });
        ret += "</p>";
      }
      open.set("parbreak", false);
      continue;
    }
    if (lp.isParbreak(cur)) {
      if (i + 1 < len) {
        const nxt = s[i + 1];
        if (
          (lp.isEnvironment(nxt) && paragraphEnvs.includes(nxt.name)) ||
          (lp.isCommand(nxt) && paragraphBreakCommands.includes(nxt.name)) ||
          paragraphKinds.includes(cur.kind)
        ) {
          if (open.get("parbreak")) ret += "</p>";
          open.set("parbreak", false);
          continue;
        }
      }
      if (open.get("parbreak")) ret += "</p>";
      if (i + 1 < len) {
        ret += `<p>`;
        open.set("parbreak", true);
      } else {
        open.set("parbreak", false);
      }
      continue;
    }
    if (lp.isCommand(cur)) {
      if (cur.name === "color") {
        if (open.get("color")) ret += "</span>";
        ret += `<span style="color: ${transformNode(
          cur.args[0].content,
          args
        )}">`;
        open.set("color", true);
        continue;
      }
      if (cur.name === "item") {
        if (open.get("item")) ret += "</li>";
        if (cur.args.length) {
          ret += `<li style="list-style:none;">${transformNode(
            cur.args[0].content,
            args
          )}`;
        } else {
          ret += `<li>`;
        }
        open.set("item", true);
        continue;
      }
    }
    ret += transformNode(cur, args);
    if (lp.isCommand(cur) && paragraphBreakCommands.includes(cur.name)) {
      if (open.get("parbreak") || i + 1 >= len) continue;
      ret += `<p>`;
      open.set("parbreak", true);
    }
  }
  if (open.get("color")) ret += "</span>";
  if (open.get("item")) ret += "</li>";
  if (open.get("parbreak")) ret += "</p>";
  return ret;
};

export const transformNode = (
  s: Node | Node[],
  args: TransformerArgs
): string => {
  const { renderMath } = args;
  if (Array.isArray(s)) return transformNodeArray(s, args);

  if (s.kind === "arg.group") {
    return transformNodeArray(s.content, args);
  }
  if (s.kind === "env") {
    if (Object.keys(textEnvTransformers).includes(s.name))
      return textEnvTransformers[s.name as keyof typeof textEnvTransformers](
        s,
        args
      );
    return transformNodeArray(s.content, args);
  }
  if (s.kind === "command") {
    if (Object.keys(commonCommandTransformers).includes(s.name))
      return commonCommandTransformers[
        s.name as keyof typeof commonCommandTransformers
      ](s, args);
    if (Object.keys(commandTransformers).includes(s.name))
      return commandTransformers[s.name as keyof typeof commandTransformers](
        s,
        args
      );
  }
  if (s.kind === "inlineMath") {
    if (!renderMath) return escapeHtml(stringify(s).trim());
    return transformMathNode(s.content, { ...args, italicMath: true });
  }
  if (s.kind === "displayMath") {
    if (!renderMath) return escapeHtml(stringify(s).trim());
    return `<div style="text-align:center;">${transformMathNode(s.content, {
      ...args,
      italicMath: true,
    })}</div>`;
  }
  if (s.kind === "space") return " ";
  if (s.kind === "softbreak" || s.kind === "linebreak") return "<br>";
  if (s.kind === "text.string") return regularizeText(escapeHtml(s.content));
  return unsupported(JSON.stringify(s));
};

export const transform = (s: AstRoot, args: TransformerArgs) => {
  try {
    return transformNodeArray(s.content, args);
  } catch (e) {
    return (e as any).toString();
  }
};
