import * as React from "react";
import { styled, Theme } from "@mui/material/styles";
import MuiTypography, { TypographyProps } from "@mui/material/Typography";

const markClassesMapping: {
  [index: string]: { [subindex: string]: string };
} = {
  center: {
    h1: "",
    h2: "markedH2Center",
    h3: "",
    h4: "",
    h5: "",
    h6: "",
  },
  none: {
    h1: "",
    h2: "",
    h3: "",
    h4: "",
    h5: "",
    h6: "",
  },
};

const styles = ({ theme }: { theme: Theme }) => ({
  [`& .${markClassesMapping.center.h2}`]: {
    height: 4,
    width: 80,
    display: "block",
    margin: `${theme.spacing(1)} auto 0`,
    backgroundColor: theme.palette.secondary.main,
  },
});

interface ExtraTypographyProps {
  marked?: "center" | "none";
}

function Typography<C extends React.ElementType>(
  props: TypographyProps<C, { component?: C }> & ExtraTypographyProps
) {
  const { children, variant, marked = "none", ...other } = props;

  let markedClassName = "";
  if (variant && variant in markClassesMapping[marked]) {
    markedClassName = markClassesMapping[marked][variant];
  }

  return (
    <MuiTypography variant={variant} {...other}>
      {children}
      {markedClassName ? <span className={markedClassName} /> : null}
    </MuiTypography>
  );
}

export default styled(Typography)(styles);
