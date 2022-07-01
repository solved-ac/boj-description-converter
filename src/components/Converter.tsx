import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Button,
  Card,
  solvedThemes,
  Space,
  TextField,
  Typo
} from "@solved-ac/ui-react";
import { MathJax } from "better-react-mathjax";
import React, { useState } from "react";
import "../boj-unify.scss";
import {
  findFirstProblemEnv,
  parse,
  transformProblemEnv
} from "../utils/parse";
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
  const [jax, setJax] = useState<boolean>(true);

  const toParse = latex || exampleDescription;
  const parsed = parse(toParse);

  const problemEnv =
    (typeof parsed !== "string" && findFirstProblemEnv(parsed.content)) || null;
  const transformed =
    (problemEnv &&
      transformProblemEnv(problemEnv, {
        renderMath: !jax,
      })) ||
    [];

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
          {jax ? " (수식 렌더: MathJax)" : " (수식 렌더: HTML)"}
          <Space w={8} />
          <Button onClick={() => setHtml((p) => !p)}>
            {html ? "미리보기로 전환" : "HTML로 전환"}
          </Button>
          <Space w={8} />
          <Button onClick={() => setJax((p) => !p)}>
            {jax ? "나는 MathJax가 싫어요" : "나는 MathJax가 좋아요"}
          </Button>
        </div>
        <div
          style={{
            flex: "1 0 0",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          {typeof transformed === "string"
            ? transformed
            : transformed.map((t) => (
                <React.Fragment key={t.title}>
                  <Typo variant="h3">{t.title}</Typo>
                  {html ? (
                    <ThemeProvider theme={solvedThemes.dark}>
                      <Card
                        contentEditable
                        style={{
                          width: "100%",
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                          whiteSpace: "break-spaces",
                        }}
                      >
                        {t.body}
                      </Card>
                    </ThemeProvider>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        flex: "1 0 0",
                      }}
                    >
                      <MathJax>
                        <RenderedDescription
                          className="preview"
                          dangerouslySetInnerHTML={{ __html: t.body }}
                        />
                      </MathJax>
                    </div>
                  )}
                </React.Fragment>
              ))}
        </div>
      </ConverterSection>
    </ConverterContainer>
  );
};

export default Converter;
