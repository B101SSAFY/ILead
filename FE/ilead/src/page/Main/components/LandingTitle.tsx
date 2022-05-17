import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../../../modules/components/Typography";
import { Container, Box, Button } from "@mui/material";
import FadeIn from "react-fade-in";
import Lottie from "lottie-react";
import animationData from "../../../assets/creativity.json";
import animationDown from "../../../assets/arrow.json";

export default function LandingTitle() {
  const navigate = useNavigate();

  const movePlay = () => {
    navigate(`/play`);
  };

  return (
    <Container
      sx={{
        mt: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FadeIn delay={200}>
        <Typography color="inherit" align="center" variant="h2" marked="center">
          ILead
        </Typography>
        <Typography
          color="inherit"
          align="center"
          variant="h5"
          sx={{ mb: 10, mt: { sx: 4, sm: 10 }, marginTop: "4px" }}
        >
          아이가 만드는 동화
        </Typography>

        <Lottie animationData={animationData} loop autoplay />
        <Box textAlign="center" sx={{ mt: 10 }}>
          <Button
            color="secondary"
            variant="contained"
            size="large"
            sx={{ minWidth: 200, minHeight: 40 }}
            onClick={movePlay}
          >
            접속하기
          </Button>
        </Box>
        <Lottie
          style={{ width: "20%", margin: "30px auto 0 auto" }}
          animationData={animationDown}
          loop
          autoplay
        />
      </FadeIn>
    </Container>
  );
}
