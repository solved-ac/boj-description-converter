import styled from "@emotion/styled";
import { Typo } from "@solved-ac/ui-react";
import React from "react";
import Converter from "./components/Converter";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <header
          style={{
            flex: "2 0 0",
            minWidth: 480,
            display: "flex",
            alignItems: "center",
            gap: "1ch",
          }}
        >
          <Typo h1 no-margin>
            BOJ Stack 디스크립션 툴
          </Typo>
          by <a href="https://solved.ac">solved.ac</a>
        </header>
      </div>
      <ul>
        <li>
          DOM 엘리먼트로 복사하려면 Stack에서 다음을 실행하세요: <br />
          <code>
            var
            o=CKEDITOR.filter.instances;Object.keys(o).forEach((k)=&gt;o[k].disable())
          </code>
        </li>
      </ul>
      <Converter />
    </AppContainer>
  );
};

export default App;
