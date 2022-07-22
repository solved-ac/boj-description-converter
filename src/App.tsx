import styled from "@emotion/styled";
import { Divider, Typo } from "@solved-ac/ui-react";
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
      <Divider />
      <Converter />
    </AppContainer>
  );
};

export default App;
