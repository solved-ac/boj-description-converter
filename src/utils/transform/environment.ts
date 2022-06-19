import { EnvTransformer } from "../helpers";
import { transformNodeArray } from "../parse";
import { unsupported } from "./textCommand";

const children: EnvTransformer = (s, args) =>
  transformNodeArray(s.content, args);

const center: EnvTransformer = (s, args) =>
  `<p style="text-align:center;">${children(s, args)}</p>`;

const quote: EnvTransformer = (s, args) =>
  `<blockquote>${children(s, args)}</blockquote>`;

const itemize: EnvTransformer = (s, args) => `<ul>${children(s, args)}</ul>`;

const enumerate: EnvTransformer = (s, args) => `<ol>${children(s, args)}</ol>`;

const example: EnvTransformer = (s, args) =>
  `<p style="text-align:center;">${unsupported("(입출력 예제)")}</p>`;

const textEnvTransformers = {
  center,
  quote,
  itemize,
  enumerate,
  example,
};

export default textEnvTransformers;
