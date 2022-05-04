import * as React from "react";
import TopBar from "../../modules/components/TopBar";
import LandingTitle from "./components/LandingTitle";
import LandingDesktop from "./components/LandingDesktop";
import LandingNotebook from "./components/LandingNotebook";
import LandingStory from "./components/LandingStory";
import PigStory from "./components/PigStory";
import HanselStory from "./components/HanselStory";
import PrinceStory from "./components/PrinceStory";
import Footer from "../../modules/components/Footer";
import withRoot from "../../modules/withRoot";
import "animate.css/animate.min.css";

function Index() {
  return (
    <React.Fragment>
      <TopBar />
      <LandingTitle />
      <LandingDesktop />
      <LandingNotebook />
      <LandingStory />
      <PigStory />
      <HanselStory />
      <PrinceStory />
      <Footer />
    </React.Fragment>
  );
}

export default withRoot(Index);