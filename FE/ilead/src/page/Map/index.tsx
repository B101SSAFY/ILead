import * as React from "react";
import UserNick from "./components/UserNick";
import TopBar from "../../modules/components/TopBar";
import Map from "./components/Map";
import Footer from "../../modules/components/Footer";
import withRoot from "../../modules/withRoot";

function Index() {
  return (
    <React.Fragment>
      <UserNick />
      <TopBar />
      <Map />
      <Footer />
    </React.Fragment>
  );
}

export default withRoot(Index);
