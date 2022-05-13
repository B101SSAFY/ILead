import * as React from "react";
import { Container } from "@mui/material";
import Guide from "./components/Guide";
import withRoot from "../../modules/withRoot";

function Index() {
  return (
    <React.Fragment>
      <Container>
        <Guide />
      </Container>
    </React.Fragment>
  );
}

export default withRoot(Index);
