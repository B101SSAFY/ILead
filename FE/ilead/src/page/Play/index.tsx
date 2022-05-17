import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../assets/loading.json";
import withRoot from "../../modules/withRoot";
import Unity, { UnityContext } from "react-unity-webgl";

function Index() {
  const unityContext = new UnityContext({
    loaderUrl: "Build/Build.loader.js",
    dataUrl: "Build/Build.data.unityweb",
    frameworkUrl: "Build/Build.framework.js.unityweb",
    codeUrl: "Build/Build.wasm.unityweb",
  });

  const [progression, setProgression] = useState(0);

  useEffect(function () {
    window.scrollTo(0, 0);
    unityContext.on("progress", function (progression) {
      setProgression(progression);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {progression === 1 ? (
        <div />
      ) : (
        <Container>
          <Lottie animationData={animationData} loop autoplay />
        </Container>
      )}
      <Unity
        unityContext={unityContext}
        style={{
          height: "100vh",
          width: "100%",
          background: "secondary.light",
          marginBottom: "-9px",
        }}
      />
    </React.Fragment>
  );
}

export default withRoot(Index);
