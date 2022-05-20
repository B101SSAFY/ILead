import * as React from "react";
import { Container } from "@mui/material";
import ScrollToTop from "../../modules/components/ScrollToTop";
import ScrollToTopPage from "../../modules/components/ScrollToTopPage";
import Guide from "./components/Guide";
import withRoot from "../../modules/withRoot";

function Index() {
  return (
    <React.Fragment>
      <ScrollToTopPage />
      <Container>
        <Guide />
      </Container>
      <ScrollToTop />
    </React.Fragment>
  );
}

export default withRoot(Index);
