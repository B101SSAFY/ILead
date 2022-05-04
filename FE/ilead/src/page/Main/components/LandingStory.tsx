import * as React from "react";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { Container, Box, Grid } from "@mui/material";
import Typography from "../../../modules/components/Typography";
import { AnimationOnScroll } from "react-animation-on-scroll";

function LandingStory() {
  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
  };

  const pig = require("../../../assets/map_pig.png");
  const hansel = require("../../../assets/map_hansel.png");
  const prince = require("../../../assets/map_prince.png");

  return (
    <Box sx={{ display: "flex", bgcolor: "secondary.light" }}>
      <Container
        sx={{
          mt: 25,
          mb: 35,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" marked="center" component="h2" sx={{ mb: 14 }}>
          세가지의 다양한 동화 이야기
        </Typography>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <AnimationOnScroll animateIn="animate__zoomIn" delay={100}>
              <Box sx={item}>
                <Box
                  component="img"
                  src={pig}
                  alt="pig"
                  sx={{ height: 330, borderRadius: "8px" }}
                />
                <Typography variant="h5" sx={{ my: 5 }}>
                  아기 돼지 삼형제
                </Typography>
              </Box>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={4}>
            <AnimationOnScroll animateIn="animate__zoomIn" delay={400}>
              <Box sx={item}>
                <Box
                  component="img"
                  src={hansel}
                  alt="hansel"
                  sx={{ height: 330, borderRadius: "8px" }}
                />
                <Typography variant="h5" sx={{ my: 5 }}>
                  헨젤과 그레텔
                </Typography>
              </Box>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={4}>
            <AnimationOnScroll animateIn="animate__zoomIn" delay={700}>
              <Box sx={item}>
                <Box
                  component="img"
                  src={prince}
                  alt="prince"
                  sx={{ height: 330, borderRadius: "8px" }}
                />
                <Typography variant="h5" sx={{ my: 5 }}>
                  어린왕자
                </Typography>
              </Box>
            </AnimationOnScroll>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingStory;
