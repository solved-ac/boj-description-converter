import { Command } from "latex-utensils/out/types/src/latex/latex_parser_types";
import { CommandTransformer, TransformerArgs, transformSimpleArg } from "../../helpers";

export enum TextSizeDefined {
  tiny = '.7em',
  scriptsize = '.75em',
  small = '.85em',
  normalsize = '1em',
  large = '1.15em',
  Large = '1.3em',
  LARGE = '1.45em',
  huge = '1.75em',
  Huge = '2em',
};

const _textSizeCommand = (ts: TextSizeDefined, s: Command, args: TransformerArgs) => 
  `<span style="font-size: ${ts};">${transformSimpleArg(s.args[0], args)}</span>`;

const tiny: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.tiny, s, args);
const scriptsize: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.scriptsize, s, args);
const small: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.small, s, args);
const normalsize: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.normalsize, s, args);
const large: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.large, s, args);
const Large: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.Large, s, args);
const LARGE: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.LARGE, s, args);
const huge: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.huge, s, args);
const Huge: CommandTransformer = (s, args) => _textSizeCommand(TextSizeDefined.Huge, s, args);

const textsizeCommandTransformers = {
  tiny,
  scriptsize,
  small,
  normalsize,
  large,
  Large,
  LARGE,
  huge,
  Huge,
};

export default textsizeCommandTransformers;
