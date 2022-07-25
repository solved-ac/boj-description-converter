import styled from "@emotion/styled";
import {
  Button, Space,
  TextField,
  Typo
} from "@solved-ac/ui-react";
import React, { useState } from "react";
import "../boj-unify.scss";
import {
  findFirstProblemEnv,
  parse,
  transformNode,
  transformProblemEnv
} from "../utils/parse";
import DescriptionRenderer from "./DescriptionRenderer";
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

const titleBojStackName = (s: string) => {
  if (s === "Statement") return "문제";
  if (s === "InputFile") return "입력";
  if (s === "OutputFile") return "출력";
  if (s === "Interaction") return "인터랙션";
  if (s === "Note") return "노트";
  if (s === "Notes") return "노트";
  if (s === "Constraints") return "제한";
  if (s === "Examples") return "예제";
  return s;
};

const Converter: React.FC = () => {
  const [latex, setLatex] = useState<string>(exampleDescription);
  const [html, setHtml] = useState<boolean>(false);
  const [jax, setJax] = useState<boolean>(true);

  const toParse = latex || exampleDescription;
  const parsed = parse(toParse);

  const problemEnv =
    (typeof parsed !== "string" && findFirstProblemEnv(parsed.content)) || null;
  const transformed = (problemEnv &&
    transformProblemEnv(problemEnv, {
      renderMath: !jax,
    })) ||
    (typeof parsed !== "string" &&
      transformNode(parsed.content, {
        renderMath: !jax,
      })) || { meta: {}, content: [] };

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
          {typeof transformed === "string" ? (
            <DescriptionRenderer html={html} content={transformed} />
          ) : (
            <>
              {transformed.meta.title && (
                <Typo
                  variant="h2"
                  dangerouslySetInnerHTML={{ __html: transformed.meta.title }}
                />
              )}
              <Typo
                variant="description"
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                {transformed.meta.input && (
                  <span>
                    <b>입력</b>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${transformed.meta.input}`,
                      }}
                    />
                  </span>
                )}
                {transformed.meta.output && (
                  <span>
                    <b>출력</b>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${transformed.meta.output}`,
                      }}
                    />
                  </span>
                )}
                {transformed.meta.timeLimit && (
                  <span>
                    <b>시간 제한</b>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${transformed.meta.timeLimit}`,
                      }}
                    />
                  </span>
                )}
                {transformed.meta.memoryLimit && (
                  <span>
                    <b>메모리 제한</b>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${transformed.meta.memoryLimit}`,
                      }}
                    />
                  </span>
                )}
              </Typo>
              {transformed.content.map((t) => (
                <React.Fragment key={t.title}>
                  <Typo variant="h3">{titleBojStackName(t.title)}</Typo>
                  <DescriptionRenderer html={html} content={t.body} />
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </ConverterSection>
    </ConverterContainer>
  );
};

export default Converter;

// CKEDITOR.config.copyFormatting_allowRules = '*'