import { CommandTransformer, transformSimpleArg } from "../../helpers";
import { transformNode } from "../../parse";

const DELIMITER = "\n\n\n\n";

const o =
  (str: TemplateStringsArray): CommandTransformer =>
  (s, args) =>
    `${DELIMITER}<!-- ${str} 섹션 -->\n<h2>${str}</h2>\n`;

export const unsupported = (s: string) =>
  `<span style="color:#f00;background:#ff0;">${s}</span>`;

const input: CommandTransformer = (s, args) =>
  `<span style="color:#e74c3c;"><code>${transformSimpleArg(
    s.args[0],
    args
  )}</code></span>`;

const regularExmp = (s: string) => {
  return s
    .split("<br>")
    .map((x) => x.trim())
    .filter((x) => x)
    .join("\n");
};

const exmp: CommandTransformer = (s, args) => {
  const res = s.args.map((a) => transformNode(a.content, args));
  return `<tr>${res
    .map((r) => `<td><pre class="sampledata">${regularExmp(r)}</pre></td>`)
    .join("")}</tr>`;
};

const olympTransformers = {
  Specification: o`사양`,
  Interaction: o`인터랙션`,
  InputFile: o`입력`,
  OutputFile: o`출력`,
  Example: o`입출력 예시`,
  Examples: o`입출력 예시`,
  Explanation: o`설명`,
  Explanations: o`설명`,
  Illustration: o`그림`,
  Scoring: o`점수 계산 방법`,
  Note: o`노트`,
  Notes: o`노트`,
  Constraints: o`제한`,
  SubtaskOne: o`서브태스크 1`,
  SubtaskTwo: o`서브태스크 2`,
  SubtaskThree: o`서브태스크 3`,
  SubtaskFour: o`서브태스크 4`,
  SubtaskFive: o`서브태스크 5`,
  SubtaskSix: o`서브태스크 6`,
  Subtask: o`서브태스크`,
  t: input,
  exmp,
};

export default olympTransformers;
