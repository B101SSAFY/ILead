import { Container, Box, Grid } from "@mui/material";
import Typography from "../../../modules/components/Typography";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { AnimationOnScroll } from "react-animation-on-scroll";
import FadeIn from "react-fade-in";

function LandingDesktop() {
  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
  };

  const desktop = require("../../../assets/desktop.png");

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
          <Grid item xs={12} md={6}>
            <AnimationOnScroll initiallyVisible animateIn="animate__fadeInUp">
              <FadeIn delay={800} transitionDuration={1000}>
                <Box sx={item}>
                  <Typography variant="h5" color="#1976D2">
                    {"동화 체험 서비스"}
                  </Typography>
                  <Typography variant="h4" sx={{ my: 5 }}>
                    {"동화 속에 들어가 "}
                    {"주인공을 도와주세요!"}
                  </Typography>
                  <Typography variant="h5" color="#000" sx={{ fontSize: 22 }}>
                    {"동화 속 환경을 직접 경험하고 "}
                    {"게임을 통해 이야기를 만들어보세요!"}
                  </Typography>
                </Box>
              </FadeIn>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimationOnScroll initiallyVisible animateIn="animate__fadeInUp">
              <FadeIn delay={800} transitionDuration={1000}>
                <Box sx={item}>
                  <Box
                    component="img"
                    src={desktop}
                    alt="desktop"
                    sx={{ height: 300 }}
                  />
                </Box>
              </FadeIn>
            </AnimationOnScroll>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingDesktop;
