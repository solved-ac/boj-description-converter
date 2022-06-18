import styled from "@emotion/styled";
import { Button, Space, TextField, Typo } from "@solved-ac/ui-react";
import { MathJax } from "better-react-mathjax";
import React, { useState } from "react";
import "../boj-unify.scss";
import { parse, transform } from "../utils/parse";
import { exampleDescription } from "./example";

const ConverterContainer = styled.div`
  flex: 1 0 0;
  height: 100%;
  display: flex;
  gap: 16px;
`;

const ConverterSection = styled.div`
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
`;

const RenderedDescription = styled.div`
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
`;

const Converter: React.FC = () => {
  const [latex, setLatex] = useState<string>(exampleDescription);
  const [html, setHtml] = useState<boolean>(false);

  const toParse = latex || exampleDescription;
  const parsed = parse(toParse);
  const transformed =
    typeof parsed === "string"
      ? parsed
      : transform(parsed, {
          renderMath: false,
        });

  console.log(parsed);
  return (
    <ConverterContainer>
      <ConverterSection>
        <Typo variant="h2">LaTeX</Typo>
        <TextField<"textarea">
          multiline
          value={latex}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setLatex(e.target.value)
          }
          style={{ width: "100%", flex: "1 0 0" }}
        />
      </ConverterSection>
      <ConverterSection>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typo variant="h2" style={{ flex: "1 0 0" }}>
            Result
          </Typo>
          {html ? "HTML 보는 중" : "미리보기 중"}
          <Space w={8} />
          <Button onClick={() => setHtml((p) => !p)}>
            {html ? "미리보기로 전환" : "HTML로 전환"}
          </Button>
        </div>
        <div
          style={{ flex: "1 0 0", display: "flex", flexDirection: "column" }}
        >
          {html ? (
            <TextField
              multiline
              style={{
                fontFamily: "monospace",
                wordBreak: "break-all",
                whiteSpace: "break-spaces",
                width: "100%",
                height: "100%",
              }}
              value={transformed}
            />
          ) : (
            <div
              style={{
                flex: "1 0 0",
                width: "100%",
                height: "100%",
                overflowY: "auto",
              }}
            >
              <MathJax>
                <RenderedDescription
                  className="preview"
                  dangerouslySetInnerHTML={{ __html: transformed }}
                />
              </MathJax>
            </div>
          )}
        </div>
      </ConverterSection>
    </ConverterContainer>
  );
};

export default Converter;
