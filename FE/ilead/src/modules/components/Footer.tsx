import * as React from "react";
import { Container, Grid } from "@mui/material";
import Typography from "./Typography";

function Copyright() {
  return (
    <React.Fragment>
      {"ⓒ 2022. ILEAD ALL rights reserved."}
      <br />
      {"팀 아이리드 : 현준 오범 민주 혜준 미래 하은"}
    </React.Fragment>
  );
}

export default function Footer() {
  return (
    <Typography component="footer" sx={{ display: "flex", bgcolor: "#F3F3F3" }}>
      <Container sx={{ my: 15, display: "flex" }}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={12}>
            <Grid container direction="column" spacing={2}>
              <Grid item sx={{ margin: "0 auto" }}>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
