import { CommandTransformer, h, s, transformSimpleArg } from "../helpers";
import { transformNode } from "../parse";

export const unsupported = (s: string) =>
  `<span style="color:#f00;background:#ff0;">${s}</span>`;

const delemiter = "\n\n\n\n";

const InputFile: CommandTransformer = () => `${delemiter}<h2>입력</h2>`;
const OutputFile: CommandTransformer = () => `${delemiter}<h2>출력</h2>`;
const Interaction: CommandTransformer = () => `${delemiter}<h2>인터랙션</h2>`;
const Note: CommandTransformer = () => `${delemiter}<h2>노트</h2>`;
const Notes: CommandTransformer = () => `${delemiter}<h2>노트</h2>`;
const Constraints: CommandTransformer = () => `${delemiter}<h2>제한</h2>`;
const Examples: CommandTransformer = () => `${delemiter}<h2>입출력 예제</h2>`;

const input: CommandTransformer = (s, args) =>
  `<span style="color:#e74c3c;"><code>${transformSimpleArg(
    s.args[0],
    args
  )}</code></span>`;
const exmp: CommandTransformer = (s, args) => {
  const res = s.args.map((a) => transformNode(a.content, args));
  return `<tr>${res.map((r) => `<td>${r}</td>`)}</tr>`;
};
const includegraphics: CommandTransformer = () =>
  unsupported("[여기에 그림 입력]");

const textCommandTransformers = {
  InputFile,
  OutputFile,
  Interaction,
  Note,
  Notes,
  Constraints,
  Examples,
  textbf: h`strong`,
  textsf: h`span`,
  textrm: h`span`,
  texttt: h`code`,
  textit: h`em`,
  underline: h`u`,
  textsuperscript: h`sup`,
  textsubscript: h`sub`,
  t: input,
  exmp,
  quad: s`&emsp;`,
  qquad: s`&emsp;&emsp;`,
  includegraphics,
};

export default textCommandTransformers;
