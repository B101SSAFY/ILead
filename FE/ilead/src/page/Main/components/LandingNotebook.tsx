import * as React from "react";
import { Container, Box, Grid } from "@mui/material";
import Typography from "../../../modules/components/Typography";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { AnimationOnScroll } from "react-animation-on-scroll";

function LandingNotebook() {
  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
  };

  const notebook = require("../../../assets/notebook.png");

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
          <Grid item xs={12} md={6}>
            <AnimationOnScroll animateIn="animate__fadeInUp">
              <Box sx={item}>
                <Box
                  component="img"
                  src={notebook}
                  alt="notebook"
                  sx={{ height: 300 }}
                />
              </Box>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimationOnScroll animateIn="animate__fadeInUp">
              <Box sx={item}>
                <Typography variant="h5" color="#1976D2">
                  {"반응형 디자인"}
                </Typography>
                <Typography variant="h4" sx={{ my: 5 }}>
                  {"언제 어디서든 최적화된 화면으로 ILEAD를 즐기세요!"}
                </Typography>
                <Typography variant="h5" color="#000" sx={{ fontSize: 22 }}>
                  {"데스크탑, 노트북, 태블릿 모두 최적화된 환경을 제공합니다."}
                  {"아이와 함께 언제, 어디서든 동화 속으로 들어오세요."}
                </Typography>
              </Box>
            </AnimationOnScroll>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingNotebook;
