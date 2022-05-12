import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../../../modules/components/Typography";
import { Container, Box, Button } from "@mui/material";

export default function UserNick() {
  const navigate = useNavigate();
  const userNick = sessionStorage.getItem("userNick");

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
      {userNick ? (
        <Typography color="inherit" align="center" variant="h3">
          {userNick}님, 반갑습니다.
        </Typography>
      ) : (
        <Box>
          <Typography color="inherit" align="center" variant="h3">
            앗! 닉네임을 설정해주세요!
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
        </Box>
      )}
    </Container>
  );
}
