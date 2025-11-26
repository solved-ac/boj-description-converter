import { latexParser as lp } from "latex-utensils";
import {
  AstRoot,
  Environment,
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
    .replace(/&#039;&#039;/g, "&rdquo;")
    .replace(/&#039;/g, "&rsquo;")
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

const bigOperators = [
  "sum",
  "prod",
  "lim",
  "liminf",
  "limsup",
  "projlim",
  "injlim",
  "plim",
  "inf",
  "sup",
  "max",
  "argmax",
  "min",
  "argmin",
  "gcd",
  "det",
  "bigcap",
  "bigcup",
  "bigodot",
  "bigoplus",
  "bigotimes",
  "bigsqcup",
  "biguplus",
  "bigvee",
  "bigwedge",
  "int",
  "coprod",
  "oint",
  "iint",
  "iiint",
  "iiiint",
  "idotsint",
  "oiint",
  "varoint",
  "varint",
];

export const isMathBigOperator = (s: Node) => {
  if (s.kind === "command") {
    return bigOperators.includes(s.name);
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

const paragraphEnvs = ["center", "figure", "itemize", "enumerate", "quote"];
const paragraphKinds = ["env.math.align"];

export const transformNodeArray = (
  s: Node[],
  args: TransformerArgs
): string => {
  const { renderMath, allowParbreaks } = args;
  const subArgs = { ...args, allowParbreaks: false };
  let ret = "";
  let paragraph = "";

  const len = s.length;
  const open = new Map<string, boolean>();

  for (let i = 0; i < len; i++) {
    const cur = s[i];
    if (lp.isEnvironment(cur)) {
      if (paragraphEnvs.includes(cur.name)) {
        if (paragraph) {
          ret += allowParbreaks ? `<p>${paragraph}</p>\n\n` : paragraph;
          paragraph = "";
        }
        ret += transformNode(cur, subArgs);
        continue;
      }
    }
    if (cur.kind === "env.math.align") {
      if (paragraph) {
        ret += allowParbreaks ? `<p>${paragraph}</p>\n\n` : paragraph;
        paragraph = "";
      }
      if (!renderMath) {
        ret += transformNode(
          { kind: "displayMath", content: [cur], location: cur.location },
          { ...subArgs, italicMath: true }
        );
      } else {
        ret += '<p style="text-align:center;">';
        ret += transformMathAlign(cur, { ...subArgs, italicMath: true });
        ret += "</p>\n\n";
      }
      continue;
    }
    if (lp.isParbreak(cur)) {
      if (i + 1 < len) {
        const nxt = s[i + 1];
        if (
          (lp.isEnvironment(nxt) && paragraphEnvs.includes(nxt.name)) ||
          paragraphKinds.includes(cur.kind)
        ) {
          if (paragraph) {
            ret += allowParbreaks ? `<p>${paragraph}</p>\n\n` : paragraph;
            paragraph = "";
          }
          continue;
        }
      }
      if (paragraph) {
        ret += allowParbreaks ? `<p>${paragraph}</p>\n\n` : paragraph;
        paragraph = "";
      }
      continue;
    }
    if (lp.isCommand(cur)) {
      if (cur.name === "color") {
        if (open.get("color")) ret += "</span>";
        ret += `<span style="color: ${transformNode(
          cur.args[0].content,
          subArgs
        )}">`;
        open.set("color", true);
        continue;
      }
    }
    paragraph += transformNode(cur, subArgs);
  }
  if (paragraph) {
    ret += allowParbreaks ? `<p>${paragraph}</p>\n\n` : paragraph;
    paragraph = "";
  }
  if (open.get("color")) ret += "</span>";
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
  if (s.kind === "command.href" || s.kind === "command.url") {
    if (s.kind === "command.href")
      return `<a href="${s.url}">${transformNodeArray(s.content, args)}</a>`;
    if (s.kind === "command.url")
      return `<a href="${s.url}">${s.url}</a>`;
  }
  if (s.kind === "env.lstlisting") {
    return `<pre><code>${escapeHtml(s.content)}</code></pre>`;
  }
  if (s.kind === "subscript" || s.kind === "superscript") {
    /**
     * for Text Escape
     * 
     * Subscript and superscript in the formula are processed in `transformMathNode()`.
     * This processing corresponds to situations where things should be treated as plain text,
     * but are processed as subscripts and superscripts in formulas.
     */
    if (s.kind === "subscript") return "_";
    if (s.kind === "superscript") return "^";
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
  if (s.kind === "space" || s.kind === "softbreak") return " ";
  if (s.kind === "linebreak") return "<br>";
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

const sectionBreakCommands = [
  "InputFile",
  "OutputFile",
  "Interaction",
  "Note",
  "Notes",
  "Constraints",
  "Examples",
];

export const transformProblem = (
  s: Node[],
  args: TransformerArgs
): { title: string; body: string }[] => {
  const ret: { title: string; body: string }[] = [];

  const len = s.length;
  let section = "Statement";
  let stack: Node[] = [];

  for (let i = 0; i < len; i++) {
    const cur = s[i];
    if (lp.isCommand(cur) && sectionBreakCommands.includes(cur.name)) {
      ret.push({ title: section, body: transformNodeArray(stack, args) });
      stack = [];
      section = cur.name;
    } else {
      stack.push(cur);
    }
  }
  if (stack) {
    const item = transformNodeArray(stack, args);
    if (item)
      ret.push({ title: section, body: transformNodeArray(stack, args) });
    stack = [];
  }

  return ret;
};

export const findFirstProblemEnv = (
  node: Node | Node[]
): Environment | null => {
  if (Array.isArray(node)) {
    return (node.find((x) => findFirstProblemEnv(x)) as Environment) || null;
  }
  if (lp.isEnvironment(node) && node.name === "problem") return node;
  return null;
};

export interface ProblemMeta {
  title?: string;
  input?: string;
  output?: string;
  timeLimit?: string;
  memoryLimit?: string;
}

export const transformProblemEnv = (
  s: Environment,
  args: TransformerArgs
):
  | string
  | {
      meta: ProblemMeta;
      content: { title: string; body: string }[];
    } => {
  if (!s) return "No problem env found.";
  try {
    const meta: ProblemMeta = {};
    const problemArgs = s.args;

    if (problemArgs.length >= 1)
      meta.title = transformNode(problemArgs[0].content, args);
    if (problemArgs.length >= 2)
      meta.input = transformNode(problemArgs[1].content, args);
    if (problemArgs.length >= 3)
      meta.output = transformNode(problemArgs[2].content, args);
    if (problemArgs.length >= 4)
      meta.timeLimit = transformNode(problemArgs[3].content, args);
    if (problemArgs.length >= 5)
      meta.memoryLimit = transformNode(problemArgs[4].content, args);

    return {
      meta,
      content: transformProblem(s.content, { ...args, allowParbreaks: true }),
    };
  } catch (e) {
    return (e as any).toString();
  }
};
