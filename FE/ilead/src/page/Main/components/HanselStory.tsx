import * as React from "react";
import { Container, Box, Grid } from "@mui/material";
import Typography from "../../../modules/components/Typography";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { AnimationOnScroll } from "react-animation-on-scroll";

function HanselStory() {
  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
  };

  const hansel = require("../../../assets/map_hansel.png");

  return (
    <Box sx={{ bgcolor: "secondary.light", display: "flex" }}>
      <Container
        sx={{
          mt: 25,
          mb: 35,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <AnimationOnScroll animateIn="animate__fadeInLeftBig">
              <Box sx={item}>
                <Box
                  component="img"
                  src={hansel}
                  alt="hansel"
                  sx={{ height: 300, borderRadius: "8px" }}
                />
              </Box>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={8} my={5}>
            <AnimationOnScroll animateIn="animate__fadeInRightBig">
              <Typography variant="h2">
                [핸젤과 그레텔]
                <Typography variant="h4">
                  <br />
                  핸젤과 그레텔의 과자집 탈출기
                </Typography>
                <Typography variant="h5">
                  <br />
                  오빠 핸젤, 여동생 그레텔과 마녀의 숨막히는 결투! 핸젤과
                  그레텔을 도와 마녀로부터 탈출하세요! 과연 아이들은 무사히
                  집으로 돌아갈 수 있을까요?
                </Typography>
              </Typography>
            </AnimationOnScroll>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HanselStory;
