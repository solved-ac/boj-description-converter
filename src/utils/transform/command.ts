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

const delemiter = "\n\n\n\n";

const InputFile: Transformer = () => `${delemiter}<h2>입력</h2>`;
const OutputFile: Transformer = () => `${delemiter}<h2>출력</h2>`;
const Interaction: Transformer = () => `${delemiter}<h2>인터랙션</h2>`;
const Note: Transformer = () => `${delemiter}<h2>노트</h2>`;
const Notes: Transformer = () => `${delemiter}<h2>노트</h2>`;
const Constraints: Transformer = () => `${delemiter}<h2>제한</h2>`;
const Examples: Transformer = () => `${delemiter}<h2>입출력 예제</h2>`;

const t: Transformer = (s, args) =>
  `<span style="color:#e74c3c;"><code>${transformSimpleArg(
    s.args[0],
    args
  )}</code></span>`;
const textbf: Transformer = (s, args) =>
  `<strong>${transformSimpleArg(s.args[0], args)}</strong>`;
const textsf: Transformer = (s, args) => transformSimpleArg(s.args[0], args);
const texttt: Transformer = (s, args) =>
  `<code>${transformSimpleArg(s.args[0], args)}</code>`;
const exmp: Transformer = (s, args) => {
  const res = s.args.map((a) => transformNode(a.content, args));
  return `<tr>${res.map((r) => `<td>${r}</td>`)}</tr>`;
};
const newpage: Transformer = () => "";
const _: Transformer = () => "_";
const quad: Transformer = () => "&nbsp;&nbsp;&nbsp;";
const qquad: Transformer = () => "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

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
  texttt,
  exmp,
  newpage,
  _,
  quad,
  qquad,
};

export default commandTransformers;
