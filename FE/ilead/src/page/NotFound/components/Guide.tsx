import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../../../modules/components/Typography";
import { Container, Box, Button } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../../assets/larva.json";

export default function Guide() {
  const navigate = useNavigate();

  const moveMain = () => {
    navigate(`/`);
  };

  return (
    <Container
      sx={{
        mt: 15,
        mb: 5,
      }}
    >
      <Box>
        <Typography
          color="inherit"
          align="center"
          variant="h1"
          style={{ marginBottom: "10px" }}
        >
          404
        </Typography>
        <Typography color="inherit" align="center" variant="h2">
          page not found
        </Typography>
        <Container
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            color="secondary"
            variant="contained"
            size="large"
            onClick={moveMain}
          >
            메인으로 이동
          </Button>
        </Container>
        <Box style={{ width: "70%", height: "70%", margin: "0 auto" }}>
          <Lottie animationData={animationData} loop autoplay />
        </Box>
      </Box>
    </Container>
  );
}
