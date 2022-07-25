import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { Card, solvedThemes } from "@solved-ac/ui-react";
import { MathJax } from "better-react-mathjax";
import { transparentize } from "polished";
import { useEffect, useState } from "react";

const CopyToClipboardOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.1s ease;
  pointer-events: none;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.color.solvedAc};
  background: ${({ theme }) => transparentize(0.9, theme.color.solvedAc)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
  backdrop-filter: blur(3px);
  color: ${({ theme }) => theme.color.text.primary.main};
`;

const CopyToClipboardWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 1 0 0;
  cursor: pointer;

  &:hover > div.overlay {
    opacity: 1;
  }
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

interface Props {
  html: boolean;
  content: string;
}

const DescriptionRenderer: React.FC<Props> = (props) => {
  const { html, content } = props;
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyToClipboard = (html?: boolean) => {
    if (html) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
      });
      return;
    }

    // Requires to run below line in Stack:
    // var o=CKEDITOR.filter.instances;Object.keys(o).forEach((k)=>o[k].disable())
    navigator.clipboard
      .write([
        new ClipboardItem({
          "text/html": new Blob([content], { type: "text/html" }),
          "text/plain": new Blob([content], { type: "text/plain" }),
        }),
      ])
      .then(() => {
        setCopied(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setCopied(false);
    }, 500);
    return () => clearTimeout(delay);
  }, [copied]);

  if (html) {
    return (
      <ThemeProvider theme={solvedThemes.dark}>
        <CopyToClipboardWrapper onClick={() => handleCopyToClipboard(true)}>
          <Card
            style={{
              width: "100%",
              fontFamily: "monospace",
              wordBreak: "break-all",
              whiteSpace: "break-spaces",
            }}
          >
            {content}
          </Card>
          <CopyToClipboardOverlay className="overlay">
            {copied ? "✓" : "HTML로 복사하기"}
          </CopyToClipboardOverlay>
        </CopyToClipboardWrapper>
      </ThemeProvider>
    );
  }

  return (
    <CopyToClipboardWrapper onClick={() => handleCopyToClipboard(false)}>
      <MathJax>
        <RenderedDescription
          className="preview"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </MathJax>
      <CopyToClipboardOverlay className="overlay">
        {copied ? "✓" : "DOM 엘리먼트로 복사하기"}
      </CopyToClipboardOverlay>
    </CopyToClipboardWrapper>
  );
};

export default DescriptionRenderer;
