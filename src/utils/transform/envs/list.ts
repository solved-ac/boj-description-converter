import { latexParser as lp } from "latex-utensils";
import { Node } from "latex-utensils/out/types/src/latex/latex_parser_types";
import { TransformerArgs } from "../../helpers";
import { transformNodeArray } from "../../parse";

export const transformListChildren = (
  s: Node[],
  args: TransformerArgs
): string => {
  let ret = "";

  const len = s.length;
  let stack: Node[] = [];

  for (let i = 0; i < len; i++) {
    const cur = s[i];
    if (lp.isCommand(cur) && cur.name === "item") {
      if (stack) {
        const item = transformNodeArray(stack, args);
        if (item) ret += `<li>${item}</li>`;
        stack = [];
      }
    } else {
      stack.push(cur);
    }
  }
  if (stack) {
    const item = transformNodeArray(stack, args);
    if (item) ret += `<li>${item}</li>`;
    stack = [];
  }
  return ret;
};
