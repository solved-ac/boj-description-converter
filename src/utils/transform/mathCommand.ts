import { CommandTransformer, s } from "../helpers";
import { transformMathNode } from "../parse";

export const mathCommandOperators = [
  "cdot",
  "gtrdot",
  "pmod",
  "cdotp",
  "intercal",
  "pod",
  "centerdot",
  "land",
  "rhd",
  "circ",
  "leftthreetimes",
  "rightthreetimes",
  "amalg",
  "circledast",
  "ldotp",
  "rtimes",
  "And",
  "circledcirc",
  "lor",
  "setminus",
  "ast",
  "circleddash",
  "lessdot",
  "smallsetminus",
  "barwedge",
  "Cup",
  "lhd",
  "sqcap",
  "bigcirc",
  "cup",
  "ltimes",
  "sqcup",
  "bmodmod",
  "bmod",
  "curlyvee",
  "mod",
  "times",
  "boxdot",
  "curlywedge",
  "mp",
  "unlhd",
  "boxminus",
  "div",
  "odot",
  "unrhd",
  "boxplus",
  "divideontimes",
  "ominus",
  "uplus",
  "boxtimes",
  "dotplus",
  "oplus",
  "vee",
  "bullet",
  "doublebarwedge",
  "otimes",
  "veebar",
  "Cap",
  "doublecap",
  "oslash",
  "wedge",
  "cap",
  "doublecup",
  "pm",
  "plusmn",
  "wr",
  "doteqdot",
  "lessapprox",
  "smile",
  "eqcirc",
  "lesseqgtr",
  "sqsubset",
  "eqcolon",
  "minuscolon",
  "lesseqqgtr",
  "sqsubseteq",
  "Eqcolon",
  "minuscoloncolon",
  "lessgtr",
  "sqsupset",
  "approx",
  "eqqcolon",
  "equalscolon",
  "lesssim",
  "sqsupseteq",
  "approxcolon",
  "Eqqcolon",
  "equalscoloncolon",
  "ll",
  "Subset",
  "approxcoloncolon",
  "eqsim",
  "lll",
  "subset",
  "sub",
  "approxeq",
  "eqslantgtr",
  "llless",
  "subseteq",
  "sube",
  "asymp",
  "eqslantless",
  "lt",
  "subseteqq",
  "backepsilon",
  "equiv",
  "mid",
  "succ",
  "backsim",
  "fallingdotseq",
  "models",
  "succapprox",
  "backsimeq",
  "frown",
  "multimap",
  "succcurlyeq",
  "between",
  "ge",
  "origof",
  "succeq",
  "bowtie",
  "geq",
  "owns",
  "succsim",
  "bumpeq",
  "geqq",
  "parallel",
  "Supset",
  "Bumpeq",
  "geqslant",
  "perp",
  "supset",
  "circeq",
  "gg",
  "pitchfork",
  "supseteq",
  "supe",
  "colonapprox",
  "ggg",
  "prec",
  "supseteqq",
  "Colonapprox",
  "coloncolonapprox",
  "gggtr",
  "precapprox",
  "thickapprox",
  "coloneq",
  "colonminus",
  "gt",
  "preccurlyeq",
  "thicksim",
  "Coloneq",
  "coloncolonminus",
  "gtrapprox",
  "preceq",
  "trianglelefteq",
  "coloneqq",
  "colonequals",
  "gtreqless",
  "precsim",
  "triangleq",
  "Coloneqq",
  "coloncolonequals",
  "gtreqqless",
  "propto",
  "trianglerighteq",
  "colonsim",
  "gtrless",
  "risingdotseq",
  "varpropto",
  "Colonsim",
  "coloncolonsim",
  "gtrsim",
  "shortmid",
  "vartriangle",
  "cong",
  "imageof",
  "shortparallel",
  "vartriangleleft",
  "curlyeqprec",
  "in",
  "isin",
  "sim",
  "vartriangleright",
  "curlyeqsucc",
  "Join",
  "simcolon",
  "vcentcolon",
  "ratio",
  "dashv",
  "le",
  "simcoloncolon",
  "vdash",
  "dblcolon",
  "coloncolon",
  "leq",
  "simeq",
  "vDash",
  "doteq",
  "leqq",
  "smallfrown",
  "Vdash",
  "Doteq",
  "leqslant",
  "smallsmile",
  "Vvdash",
  "gnapprox",
  "ngeqslant",
  "nsubseteq",
  "precneqq",
  "gneq",
  "ngtr",
  "nsubseteqq",
  "precnsim",
  "gneqq",
  "nleq",
  "nsucc",
  "subsetneq",
  "gnsim",
  "nleqq",
  "nsucceq",
  "subsetneqq",
  "gvertneqq",
  "nleqslant",
  "nsupseteq",
  "succnapprox",
  "lnapprox",
  "nless",
  "nsupseteqq",
  "succneqq",
  "lneq",
  "nmid",
  "ntriangleleft",
  "succnsim",
  "lneqq",
  "notin",
  "ntrianglelefteq",
  "supsetneq",
  "lnsim",
  "notni",
  "ntriangleright",
  "supsetneqq",
  "lvertneqq",
  "nparallel",
  "ntrianglerighteq",
  "varsubsetneq",
  "ncong",
  "nprec",
  "nvdash",
  "varsubsetneqq",
  "ne",
  "npreceq",
  "nvDash",
  "varsupsetneq",
  "neq",
  "nshortmid",
  "nVDash",
  "varsupsetneqq",
  "ngeq",
  "nshortparallel",
  "nVdash",
  "ngeqq",
  "nsim",
  "precnapprox",
  "circlearrowleft",
  "leftharpoonup",
  "rArr",
  "circlearrowright",
  "leftleftarrows",
  "rarr",
  "curvearrowleft",
  "leftrightarrow",
  "restriction",
  "curvearrowright",
  "Leftrightarrow",
  "rightarrow",
  "Darr",
  "leftrightarrows",
  "Rightarrow",
  "dArr",
  "leftrightharpoons",
  "rightarrowtail",
  "darr",
  "leftrightsquigarrow",
  "rightharpoondown",
  "dashleftarrow",
  "Lleftarrow",
  "rightharpoonup",
  "dashrightarrow",
  "longleftarrow",
  "rightleftarrows",
  "downarrow",
  "Longleftarrow",
  "rightleftharpoons",
  "Downarrow",
  "longleftrightarrow",
  "rightrightarrows",
  "downdownarrows",
  "Longleftrightarrow",
  "rightsquigarrow",
  "downharpoonleft",
  "longmapsto",
  "Rrightarrow",
  "downharpoonright",
  "longrightarrow",
  "Rsh",
  "gets",
  "Longrightarrow",
  "searrow",
  "Harr",
  "looparrowleft",
  "swarrow",
  "hArr",
  "looparrowright",
  "to",
  "harr",
  "Lrarr",
  "twoheadleftarrow",
  "hookleftarrow",
  "lrArr",
  "twoheadrightarrow",
  "hookrightarrow",
  "lrarr",
  "Uarr",
  "iff",
  "Lsh",
  "uArr",
  "impliedby",
  "mapsto",
  "uarr",
  "implies",
  "nearrow",
  "uparrow",
  "Larr",
  "nleftarrow",
  "Uparrow",
  "lArr",
  "nLeftarrow",
  "updownarrow",
  "larr",
  "nleftrightarrow",
  "Updownarrow",
  "leadsto",
  "nLeftrightarrow",
  "upharpoonleft",
  "leftarrow",
  "nrightarrow",
  "upharpoonright",
  "Leftarrow",
  "nRightarrow",
  "upuparrows",
  "leftarrowtail",
  "nwarrow",
  "leftharpoondown",
  "Rarr",
  "in",
  "ni",
  "isin",
  "subset",
  "supset",
  "mid",
  "land",
  "lor",
  "notni",
  "sum",
  "int",
  "iint",
  "iiint",
  "oint",
  "oiint",
  "oiiint",
  "prod",
  "coprod",
  "bigotimes",
  "bigoplus",
  "bigodot",
  "biguplus",
  "bigvee",
  "bigwedge",
  "bigcap",
  "bigsqcap",
  "bigcup",
  "arcsin",
  "cosec",
  "deg",
  "sec",
  "arccos",
  "cosh",
  "dim",
  "sin",
  "arctan",
  "cot",
  "exp",
  "sinh",
  "arctg",
  "cotg",
  "hom",
  "sh",
  "arcctg",
  "coth",
  "ker",
  "tan",
  "arg",
  "csc",
  "lg",
  "tanh",
  "ch",
  "ctg",
  "ln",
  "tg",
  "cos",
  "cth",
  "log",
  "th",
  "argmax",
  "injlim",
  "min",
  "varinjlim",
  "argmin",
  "lim",
  "plim",
  "varliminf",
  "det",
  "liminf",
  "Pr",
  "varlimsup",
  "gcd",
  "limsup",
  "projlim",
  "varprojlim",
  "inf",
  "max",
  "sup",
  "operatorname",
];

const frac: CommandTransformer = (s, args) => {
  const [p, q] = s.args;
  return `<span style="display:inline-flex;flex-direction:column;text-align:center;vertical-align:middle;"><span style="border-bottom:1px solid black;padding:0 0.5ch;">${transformMathNode(
    p,
    args
  )}</span><span style="padding:0 0.5ch;">${transformMathNode(
    q,
    args
  )}</span></span>`;
};

const underline: CommandTransformer = (s, args) => {
  return `<u>${transformMathNode(s.args[0], args)}</u>`;
};

const mathsf: CommandTransformer = (s, args) => {
  return transformMathNode(s.args[0], args);
};

const mathbf: CommandTransformer = (s, args) => {
  return `<strong>${transformMathNode(s.args[0], args)}</strong>`;
};

const mathrm: CommandTransformer = (s, args) => {
  return transformMathNode(s.args[0], {
    ...args,
    italicMath: false,
  });
};

const sqrt: CommandTransformer = (s, args) => {
  if (!s.args.length) return "√";
  return `√<span style="text-decoration:overline;"> ${transformMathNode(
    s.args[0],
    args
  )}</span>`;
};

const mathCommandTransformers = {
  displaystyle: s``,
  mathsf,
  mathbf,
  mathrm,
  operatorname: mathrm,
  frac,
  underline,
  arcsin: s`arcsin`,
  cosec: s`cosec`,
  deg: s`deg`,
  sec: s`sec`,
  arccos: s`arccos`,
  cosh: s`cosh`,
  dim: s`dim`,
  sin: s`sin`,
  arctan: s`arctan`,
  cot: s`cot`,
  exp: s`exp`,
  sinh: s`sinh`,
  arctg: s`arctg`,
  cotg: s`cotg`,
  hom: s`hom`,
  sh: s`sh`,
  arcctg: s`arcctg`,
  coth: s`coth`,
  ker: s`ker`,
  tan: s`tan`,
  arg: s`arg`,
  csc: s`csc`,
  lg: s`lg`,
  tanh: s`tanh`,
  ch: s`ch`,
  ctg: s`ctg`,
  ln: s`ln`,
  tg: s`tg`,
  cos: s`cos`,
  cth: s`cth`,
  log: s`log`,
  th: s`th`,
  argmax: s`arg max`,
  injlim: s`inj lim`,
  min: s`min`,
  argmin: s`arg min`,
  lim: s`lim`,
  plim: s`plim`,
  det: s`det`,
  liminf: s`liminf`,
  Pr: s`Pr`,
  gcd: s`gcd`,
  limsup: s`lim sup`,
  projlim: s`proj lim`,
  inf: s`inf`,
  max: s`max`,
  sup: s`sup`,
  sqrt,
};

export default mathCommandTransformers;
