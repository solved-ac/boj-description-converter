import { NodeTransformer } from "../helpers";
import {
  isMathOperator,
  parse,
  transform,
  transformMathNode,
  transformNode
} from "../parse";

export const mathOperators = "+-*/|<>=&:";

const superscript: NodeTransformer = (s, args) =>
  (s.kind === "superscript" &&
    s.arg &&
    `<sup>${transformMathNode(s.arg, args)}</sup>`) ||
  "";

const subscript: NodeTransformer = (s, args) =>
  (s.kind === "subscript" &&
    s.arg &&
    `<sub>${transformMathNode(s.arg, args)}</sub>`) ||
  "";

const character: NodeTransformer = (s, args) => {
  const { italicMath } = args;
  if (s.kind !== "math.character") return "";
  if (/[0-9,(){}[\]]/.exec(s.content) || isMathOperator(s))
    return s.content.replace(/-/gi, "&minus;");
  return italicMath ? `<em>${s.content}</em>` : s.content;
};

const delimiter: NodeTransformer = (s, args) => {
  if (s.kind !== "math.math_delimiters") return "";
  const lp = parse(`$${s.left}$`);
  const l = typeof lp !== "string" && transform(lp, args);
  const rp = parse(`$${s.right}$`);
  const r = typeof rp !== "string" && transform(rp, args);
  return `${l}${transformMathNode(s.content, args)}${r}`;
};

const matchingDelimiter: NodeTransformer = (s, args) => {
  if (s.kind !== "math.matching_delimiters") return "";
  const lp = parse(`$${s.left}$`);
  const l = typeof lp !== "string" && transform(lp, args);
  const rp = parse(`$${s.right}$`);
  const r = typeof rp !== "string" && transform(rp, args);
  return `${l}${transformMathNode(s.content, args)}${r}`;
};

const linebreak: NodeTransformer = (s, args) => {
  return "<br/>";
};

const text: NodeTransformer = (s, args) => {
  if (s.kind !== "command.text") return "";
  return transformNode(s.arg, args);
};

const alignmentTab: NodeTransformer = (s, args) => {
  if (s.kind !== "alignmentTab") return "";
  return "";
};

const mathKindTransformers = {
  superscript,
  subscript,
  "math.character": character,
  "math.math_delimiters": delimiter,
  "math.matching_delimiters": matchingDelimiter,
  "command.text": text,
  alignmentTab,
  linebreak,
};

export default mathKindTransformers;
