import { Group } from "latex-utensils/out/types/src/latex/latex_parser";

export type LatexUnit =
  | "pt"
  | "mm"
  | "cm"
  | "in"
  | "ex"
  | "em"
  | "bp"
  | "pc"
  | "dd"
  | "cc"
  | "nd"
  | "nc"
  | "sp"
  | `\\${string}`;

export type LatexDimens = [number, LatexUnit];

const latexUnitRegex =
  /^([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))?(pt|mm|cm|in|ex|em|bp|pc|dd|cc|nd|nc|sp|\\.+)$/gi;

export const parseLatexDimens = (s: string): LatexDimens => {
  latexUnitRegex.lastIndex = 0;
  const match = latexUnitRegex.exec(s);
  if (!match) return [0, "mm"];
  return [match[1] ? +match[1] : 0, match[4] as LatexUnit];
};

// https://en.wikibooks.org/wiki/LaTeX/Lengths
export const toCssDimens = (
  [v, unit]: LatexDimens,
  args: {
    // use TeX definitions instead of matching CSS ones
    strict?: boolean;
    // use px and relative units only
    screen?: boolean;
    // if screen, round to integer pixels
    round?: boolean;
  } = { strict: true, screen: true, round: true }
): string => {
  const { strict, screen, round } = args;

  // TeX-specific: bp, dd, cc, nd, nc, sp
  if (unit === "bp") return toCssDimens([v / 72, "in"], args);
  if (unit === "dd") return toCssDimens([(v * 1238) / 1157, "pt"], args);
  if (unit === "cc") return toCssDimens([(v * 1238 * 12) / 1157, "pt"], args);
  if (unit === "nd") return toCssDimens([(v * 685) / 642, "pt"], args);
  if (unit === "nc") return toCssDimens([(v * 685 * 12) / 642, "pt"], args);
  if (unit === "sp") return toCssDimens([v / 65536, "pt"], args);

  // Non-inch units: mm, cm
  if (unit === "mm") return toCssDimens([v / 10 / 2.54, "in"], args);
  if (unit === "cm") return toCssDimens([v / 2.54, "in"], args);

  // Relative units: ex, em
  if (unit === "ex" || unit === "em") return `${v}${unit}`;

  // Both defined in TeX and CSS: pt, pc
  if (unit === "pt") {
    if (strict) return toCssDimens([v / 72.27, "in"], args);
    return toCssDimens([v / 72, "in"], args);
  }
  if (unit === "pc") return toCssDimens([v * 12, "pt"], args);

  // Base unit: in
  if (unit === "in") {
    if (screen) return `${round ? Math.round(v * 96) : v * 96}px`;
    return `${v}${unit}`;
  }
  if (!v) return "0";

  // Default lengths
  if (unit === "\\paperwidth") return `${v * 100}vw`;
  if (unit === "\\paperheight") return `${v * 100}vh`;
  if (unit === "\\linewidth") return `${v * 100}%`;
  if (unit === "\\textwidth") return `${v * 100}%`;
  if (unit === "\\parskip") return `${v}em`;

  return "0";
};

export const groupToCssDimens = (widthArg: Group) => {
  const dimen = widthArg.content
    .map((c) => {
      if (c.kind === "command") return `\\${c.name}`;
      if (c.kind === "text.string") return c.content;
      return "";
    })
    .join("");

  return toCssDimens(parseLatexDimens(dimen));
};
