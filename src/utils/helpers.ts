import { latexParser as lp } from "latex-utensils";
import {
    Command,
    Node
} from "latex-utensils/out/types/src/latex/latex_parser_types";
import { transformNode } from "./parse";

export type CommandTransformer = (s: Command, args: TransformerArgs) => string;
export type NodeTransformer = (s: Node, args: TransformerArgs) => string;

export interface TransformerArgs {
  renderMath?: boolean;
  italicMath?: boolean;
}

export const transformSimpleArg = (
  arg: lp.Group | lp.OptionalArg,
  args: TransformerArgs
): string => {
  return transformNode(arg.content, args);
};

export const h =
  (str: TemplateStringsArray): CommandTransformer =>
  (s, args) =>
    `<${str}>${transformSimpleArg(s.args[0], args)}</${str}>`;

export const s =
  (str: TemplateStringsArray): CommandTransformer =>
  () =>
    str[0];
