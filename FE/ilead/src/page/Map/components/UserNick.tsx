import * as React from "react";
import Typography from "../../../modules/components/Typography";
import { Container } from "@mui/material";

export default function UserNick() {
  const userNick = sessionStorage.getItem("userNick");

  return (
    <Container
      sx={{
        mt: 25,
        mb: 10,
      }}
    >
      <Typography color="inherit" align="center" variant="h3">
        {userNick}님, 반갑습니다.
      </Typography>
    </Container>
  );
}
