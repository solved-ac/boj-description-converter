import { latexParser as lp } from "latex-utensils";
import {
  AstRoot,
  Node
} from "latex-utensils/out/types/src/latex/latex_parser_types";
import { stringify } from "./stringify";
import commandTransformers from "./transform/command";

export const regularizeText = (s: string) =>
  s
    .replace(/``/g, "&ldquo;")
    .replace(/''/g, "&rdquo;")
    .replace(/"/g, "&rdquo;")
    .replace(/`/g, "&lsquo;")
    .replace(/'/g, "&rsquo;");

export const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export interface TransformerArgs {
  renderMath?: boolean;
}

export const parse = (s: string): AstRoot | string => {
  try {
    return lp.parse(s, { startRule: "Root" }) as AstRoot;
  } catch (e) {
    return s;
  }
};

export const transformMathNode = (s: Node, args: TransformerArgs): string => {
  return JSON.stringify(s);
};

const paragraphEnvs = ["center", "figure"];

export const transformNodeArray = (
  s: Node[],
  args: TransformerArgs
): string => {
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
    if (lp.isParbreak(cur)) {
      if (i + 1 < len) {
        const nxt = s[i + 1];
        if (lp.isEnvironment(nxt) && paragraphEnvs.includes(nxt.name)) {
          if (open.get("parbreak")) ret += "</p>";
          open.set("parbreak", false);
          continue;
        }
      }
      if (open.get("parbreak")) ret += "</p>";
      ret += `<p>`;
      open.set("parbreak", true);
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
        ret += `<li>`;
        open.set("item", true);
        continue;
      }
    }
    ret += transformNode(cur, args);
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
    const children = transformNodeArray(s.content, args);
    if (s.name === "center") {
      return `<p style="text-align:center;">${children}</p>`;
    }
    if (s.name === "itemize") {
      return `<ul>${children}</ul>`;
    }
    if (s.name === "enumerate") {
      return `<ol>${children}</ol>`;
    }
    if (s.name === "figure") {
      return `<p style="text-align:center;">[여기에 그림 입력]</p>`;
    }
    if (s.name === "example") {
      return "(입출력 예제)";
    }
    return transformNodeArray(s.content, args);
  }
  if (s.kind === "command") {
    if (Object.keys(commandTransformers).includes(s.name))
      return commandTransformers[s.name as keyof typeof commandTransformers](
        s,
        args
      );
  }
  if (s.kind === "inlineMath") {
    if (!renderMath) return escapeHtml(stringify(s).trim());
    return transformMathNode(s, args);
  }
  if (s.kind === "displayMath") {
    if (!renderMath) return escapeHtml(stringify(s).trim());
    return transformMathNode(s, args);
  }
  if (s.kind === "space") return " ";
  if (s.kind === "softbreak") return "<br/>";
  if (s.kind === "linebreak") return "<br/>";
  if (s.kind === "text.string") return regularizeText(s.content);
  return JSON.stringify(s);
};

export const transform = (s: AstRoot, args: TransformerArgs) => {
  try {
    return transformNodeArray(s.content, args);
  } catch (e) {
    return (e as any).toString();
  }
};
