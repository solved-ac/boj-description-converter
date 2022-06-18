import { latexParser as lp } from "latex-utensils";
import { Command } from "latex-utensils/out/types/src/latex/latex_parser_types";
import { TransformerArgs, transformNode } from "../parse";

type Transformer = (s: Command, args: TransformerArgs) => string;

export const transformSimpleArg = (
  arg: lp.Group | lp.OptionalArg,
  args: TransformerArgs
): string => {
  return transformNode(arg.content, args);
};

const InputFile: Transformer = () => "<h2>입력</h2>";
const OutputFile: Transformer = () => "<h2>출력</h2>";
const Interaction: Transformer = () => "<h2>인터랙션</h2>";
const Note: Transformer = () => "<h2>노트</h2>";
const Notes: Transformer = () => "<h2>노트</h2>";
const Constraints: Transformer = () => "<h2>제한</h2>";
const Examples: Transformer = () => "<h2>입출력 예제</h2>";

const t: Transformer = (s, args) =>
  `<span style="color:#e74c3c;"><code>${transformSimpleArg(
    s.args[0],
    args
  )}</code></span>`;
const textbf: Transformer = (s, args) =>
  `<strong>${transformSimpleArg(s.args[0], args)}</strong>`;
const textsf: Transformer = (s, args) => transformSimpleArg(s.args[0], args);
const exmp: Transformer = (s, args) => {
  const res = s.args.map((a) => transformNode(a.content, args));
  return `<tr>${res.map((r) => `<td>${r}</td>`)}</tr>`;
};
const newpage: Transformer = () => "";

const commandTransformers = {
  InputFile,
  OutputFile,
  Interaction,
  Note,
  Notes,
  Constraints,
  Examples,
  t,
  textbf,
  textsf,
  exmp,
  newpage,
};

export default commandTransformers;
