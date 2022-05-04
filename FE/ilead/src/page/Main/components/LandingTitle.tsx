import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../../../modules/components/Typography";
import { Container, Button, TextField } from "@mui/material";
import FadeIn from "react-fade-in";

export default function LandingTitle() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const saveNickname = () => {
    if (nickname.length !== 0) {
      sessionStorage.setItem("userNick", nickname);
      navigate(`/map`);
    }
  };

  return (
    <Container
      sx={{
        mt: 30,
        mb: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FadeIn delay={100}>
        <Typography color="inherit" align="center" variant="h2" marked="center">
          ILead
        </Typography>

        <Typography
          color="inherit"
          align="center"
          variant="h5"
          sx={{ mb: 4, mt: { sx: 4, sm: 10 }, marginTop: "4px" }}
        >
          아이가 만드는 동화
        </Typography>
        <TextField
          sx={{
            backgroundColor: "white",
            borderRadius: "4px",
            width: "200px",
            marginBottom: "10px",
          }}
          placeholder="닉네임"
          size="small"
          value={nickname}
          onChange={onChangeNickname}
        />
        <Button
          color="secondary"
          variant="contained"
          size="large"
          sx={{ minWidth: 200 }}
          onClick={saveNickname}
        >
          접속
        </Button>
      </FadeIn>
    </Container>
  );
}
