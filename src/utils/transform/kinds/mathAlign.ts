import { Node } from "latex-utensils/out/types/src/latex/latex_parser_types";
import { NodeTransformer } from "../../helpers";
import { transformMathNodeArray } from "../../parse";

const transformMathAlign: NodeTransformer = (s, args) => {
  if (s.kind !== "env.math.align") return "";
  let ret = "";

  const len = s.content.length;
  const open = new Map<string, boolean>();

  ret += '<span style="display:flex;">';
  open.set("line", true);

  ret += '<span style="flex:1;text-align:right;">';
  open.set("equation", true);

  let tempNodes: Node[] = [];

  for (let i = 0; i < len; i++) {
    const cur = s.content[i];
    if (cur.kind === "alignmentTab") {
      ret += transformMathNodeArray(tempNodes, args);
      tempNodes = [];
      if (open.get("equation")) {
        ret += '</span><span style="flex:1;text-align:left;">&nbsp;';
      } else {
        ret += '</span><span style="flex:1;text-align:right;">';
      }
      continue;
    }
    if (cur.kind === "linebreak") {
      ret += transformMathNodeArray(tempNodes, args);
      tempNodes = [];
      if (open.get("equation")) {
        ret += "</span>";
        open.set("equation", false);
      }
      if (open.get("line")) {
        ret += "</span>";
        open.set("line", false);
      }
      if (i + 1 < len) {
        ret += '<span style="display:flex;">';
        open.set("line", true);

        ret += '<span style="flex:1;text-align:right;">';
        open.set("equation", true);
      }
      continue;
    }
    tempNodes.push(cur);
  }
  ret += transformMathNodeArray(tempNodes, args);
  tempNodes = [];

  return ret;
};

export default transformMathAlign;
