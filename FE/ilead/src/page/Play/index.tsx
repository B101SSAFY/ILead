import * as React from "react";
import withRoot from "../../modules/withRoot";
import Unity, { UnityContext } from "react-unity-webgl";

function Index() {
  const unityContext = new UnityContext({
    loaderUrl: "Build/Build.loader.js",
    dataUrl: "Build/Build.data.unityweb",
    frameworkUrl: "Build/Build.framework.js.unityweb",
    codeUrl: "Build/Build.wasm.unityweb",
  });

  return (
    <React.Fragment>
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
