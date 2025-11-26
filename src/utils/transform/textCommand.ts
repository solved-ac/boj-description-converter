import { groupToCssDimens } from "../dimens";
import { CommandTransformer, h, s } from "../helpers";
import { transformNodeArray } from "../parse";
import olympTransformers from "./commands/olymp";
import textsizeCommandTransformers from "./commands/textsize";

export const unsupported = (s: string) =>
  `<span style="color:#f00;background:#ff0;">${s}</span>`;

const includegraphics: CommandTransformer = (s, args) => {
  const urlArgs = s.args.filter((a) => a.kind === "arg.group");
  return unsupported(
    `[여기에 그림 입력: <code>"${transformNodeArray(urlArgs, args)}"</code>]`
  );
};

const textmd: CommandTransformer = (s, args) => {
  return `<span style="font-weight:normal;">${transformNodeArray(
    s.args,
    args
  )}</span>`;
};

const caption: CommandTransformer = (s, args) => {
  return `<figcaption style="text-align:center;">그림 ${unsupported(
    "A.0"
  )}: ${transformNodeArray(s.args, args)}</figcaption>`;
};

const vspace: CommandTransformer = (s, args) => {
  if (s.args.length !== 1) return "";
  if (s.args[0].kind !== "arg.group") return "";

  return `<span style="display:block;height:${groupToCssDimens(
    s.args[0]
  )}"></span>`;
};

const hspace: CommandTransformer = (s, args) => {
  if (s.args.length !== 1) return "";
  if (s.args[0].kind !== "arg.group") return "";

  return `<span style="display:inline-block;width:${groupToCssDimens(
    s.args[0]
  )}"></span>`;
};

const textCommandTransformers = {
  // The order has referred to this page: https://polygon.codeforces.com/docs/statements-tex-manual
  ...olympTransformers,
  bf: h`strong`,
  textbf: h`strong`,
  it: h`em`,
  textit: h`em`,
  /* t: defined at `commands/olymp.ts` */
  tt: h`code`,
  texttt: h`code`,
  emph: h`u`,
  underline: h`u`,
  sout: h`del`,
  textsc: h`del`,
  ...textsizeCommandTransformers,
  includegraphics,
  epigraph: h`blockquote`,
  textmd,
  textsf: h`span`,
  textrm: h`span`,
  textsuperscript: h`sup`,
  textsubscript: h`sub`,
  centering: s``,
  caption,
  vspace,
  hspace,
};

export default textCommandTransformers;
