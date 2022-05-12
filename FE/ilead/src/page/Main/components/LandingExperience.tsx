import { Container, Box, Grid } from "@mui/material";
import Typography from "../../../modules/components/Typography";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { AnimationOnScroll } from "react-animation-on-scroll";
import Lottie from "lottie-react";
import animationData from "../../../assets/microphone.json";

function LandingDesktop() {
  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 5,
  };

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
        <Grid container spacing={15}>
          <Grid item xs={12} md={6} sx={{ margin: "auto 0" }}>
            <AnimationOnScroll animateIn="animate__fadeInUp">
              <Typography variant="h5" color="#1976D2">
                {"동화 체험 서비스"}
              </Typography>
              <Typography variant="h4" sx={{ my: 5 }}>
                {"동화 속에 들어가 "}
                {"주인공을 도와주세요!"}
              </Typography>
              <Typography variant="h5" color="#000" sx={{ fontSize: 22 }}>
                {
                  "음성 인식을 통해 동화 속 환경을 직접 경험하고 게임을 통해 이야기를 만들어보세요!"
                }
              </Typography>
            </AnimationOnScroll>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimationOnScroll animateIn="animate__fadeInUp">
              <Box sx={item}>
                <Lottie animationData={animationData} loop autoplay />
              </Box>
            </AnimationOnScroll>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingDesktop;
