import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../../../modules/components/Typography";
import { Container, Box, Button } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../../modules/components/larva.json";

export default function Guide() {
  const navigate = useNavigate();

  const moveMain = () => {
    navigate(`/`);
  };

  return (
    <Container
      sx={{
        mt: 25,
        mb: 10,
      }}
    >
      <Box>
        <Typography color="inherit" align="center" variant="h3">
          앗! 닉네임과 맵을 설정해주세요!
        </Typography>
        <Container
          sx={{
            mt: 4,
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
        <Container
          sx={{
            mb: 40,
          }}
        >
          <Box style={{ width: "60%", height: "60%", margin: "0 auto" }}>
            <Lottie animationData={animationData} loop autoplay />
          </Box>
        </Container>
      </Box>
    </Container>
  );
}
