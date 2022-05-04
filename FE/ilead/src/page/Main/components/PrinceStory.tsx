import * as React from "react";
import { Container, Box, Grid } from "@mui/material";
import Typography from "../../../modules/components/Typography";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { AnimationOnScroll } from "react-animation-on-scroll";

function PrinceStory() {
  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
  };

  const prince = require("../../../assets/map_prince.png");

  return (
    <Box sx={{ display: "flex" }}>
      <Container
        sx={{
          mt: 25,
          mb: 35,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={8} my={5}>
            <AnimationOnScroll animateIn="animate__fadeInLeftBig">
              <Typography variant="h2">
                [어린왕자]
                <Typography variant="h4">
                  <br />
                  B-612라는 소행성에서 살고 있던 소년의 이야기
                </Typography>
                <Typography variant="h5">
                  <br />
                  준비중입니다.
                </Typography>
              </Typography>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={4}>
            <AnimationOnScroll animateIn="animate__fadeInRightBig">
              <Box sx={item}>
                <Box
                  component="img"
                  src={prince}
                  alt="prince"
                  sx={{ height: 300, borderRadius: "8px" }}
                />
              </Box>
            </AnimationOnScroll>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PrinceStory;
