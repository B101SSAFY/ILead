import * as React from "react";
import { Container } from "@mui/material";
import TopBar from "../../modules/components/TopBar";
import Guide from "./components/Guide";
import withRoot from "../../modules/withRoot";
import Unity, { UnityContext } from "react-unity-webgl";

function Index() {
  const userNick = sessionStorage.getItem("userNick");
  const map = sessionStorage.getItem("Map");

  const unityContext = new UnityContext({
    loaderUrl: "Build/Build.loader.js",
    dataUrl: "Build/Build.data.unityweb",
    frameworkUrl: "Build/Build.framework.js.unityweb",
    codeUrl: "Build/Build.wasm.unityweb",
  });

  return (
    <React.Fragment>
      {userNick && map ? (
        <Unity
          unityContext={unityContext}
          style={{
            height: "100vh",
            width: "100%",
            background: "secondary.light",
            marginBottom: "-9px",
          }}
        />
      ) : (
        <Container>
          <TopBar />
          <Guide />
        </Container>
      )}
    </React.Fragment>
  );
}

export default withRoot(Index);
