import * as React from "react";
import { Container, Box, Grid } from "@mui/material";
import Typography from "../../../modules/components/Typography";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { AnimationOnScroll } from "react-animation-on-scroll";

function PigStory() {
  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
  };

  const pig = require("../../../assets/map_pig.png");

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
                [아기 돼지 삼형제]
                <Typography variant="h4">
                  <br />
                  아기 돼지 삼형제 집짓는 이야기
                </Typography>
                <Typography variant="h5">
                  <br />
                  게으른 첫째, 겉멋든 둘째, 성실한 셋째와 늑대의 집지키기 싸움!
                  아기 돼지 삼형제를 도와 집을 완성해주세요! 과연 제일 튼튼한
                  집을 지은 아기 돼지는 누구일까요?
                </Typography>
              </Typography>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={4}>
            <AnimationOnScroll animateIn="animate__fadeInRightBig">
              <Box sx={item}>
                <Box
                  component="img"
                  src={pig}
                  alt="pig"
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

export default PigStory;
