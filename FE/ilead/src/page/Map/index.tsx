import * as React from "react";
import UserNick from "./components/UserNick";
import TopBar from "../../modules/components/TopBar";
import Map from "./components/Map";
import withRoot from "../../modules/withRoot";

function Index() {
  return (
    <React.Fragment>
      <UserNick />
      <TopBar />
      <Map />
    </React.Fragment>
  );
}

export default withRoot(Index);
