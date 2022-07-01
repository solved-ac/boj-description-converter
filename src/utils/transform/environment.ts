import { EnvTransformer } from "../helpers";
import { transformNodeArray } from "../parse";
import { transformListChildren } from "./envs/list";

const children: EnvTransformer = (s, args) =>
  transformNodeArray(s.content, args);

const problem: EnvTransformer = (s, args) =>
  transformNodeArray(s.content, { ...args, allowParbreaks: true });

const center: EnvTransformer = (s, args) =>
  `<p style="text-align:center;">${children(s, args)}</p>\n\n`;

const quote: EnvTransformer = (s, args) =>
  `<blockquote>${children(s, { ...args, allowParbreaks: true })}</blockquote>`;

const itemize: EnvTransformer = (s, args) =>
  `<ul>${transformListChildren(s.content, args)}</ul>\n\n`;

const enumerate: EnvTransformer = (s, args) =>
  `<ol>${transformListChildren(s.content, args)}</ol>\n\n`;

const example: EnvTransformer = (s, args) =>
  `<table style="table-layout: fixed;"><thead><tr><td>표준 입력(stdin)</td><td>표준 출력(stdout)</td></tr></thead><tbody>${transformNodeArray(
    s.content.filter((s) => s.kind === "command" && s.name === "exmp"),
    args
  )}</tbody></table>`;

const figure: EnvTransformer = (s, args) =>
  `<figure>${children(s, args)}</figure>`;

const textEnvTransformers = {
  problem,
  center,
  quote,
  itemize,
  enumerate,
  example,
  figure,
};

export default textEnvTransformers;
