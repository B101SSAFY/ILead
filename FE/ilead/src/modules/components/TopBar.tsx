import * as React from "react";
import { Link } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

function TopBar() {
  return (
    <div>
      <AppBar elevation={0} position="fixed">
        <Toolbar sx={{ height: 64 }}>
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="/"
            sx={{ fontSize: 24 }}
          >
            {"ILead"}
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopBar;
