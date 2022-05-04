import React, { useState } from "react";
import { Container, Box, Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import FadeIn from "react-fade-in";
import FlipCard from "flip-card-react";
import { BrowserView, MobileView } from "react-device-detect";

function PigStory() {
  const saveMap = (map: any) => {
    sessionStorage.setItem("Map", map);
  };

  const pig = require("../../../assets/select_pig.png");
  const hansel = require("../../../assets/select_hansel.png");
  const prince = require("../../../assets/select_prince.png");
  const click_pig = require("../../../assets/click_pig.png");
  const click_hansel = require("../../../assets/click_hansel.png");
  const click_prince = require("../../../assets/click_prince.png");

  const item: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  };

  const [pigFlipped, setPigFlipped] = useState(false);
  const [hanselFlipped, setHanselFlipped] = useState(false);
  const [princeFlipped, setPrinceFlipped] = useState(false);

  const pig_front = (
    <div>
      <BrowserView>
        <div onMouseEnter={() => setPigFlipped((x) => !x)}>
          <img src={pig} alt="pig" width="350" height="600" />
        </div>
      </BrowserView>
      <MobileView>
        <div onClick={() => setPigFlipped((x) => !x)}>
          <img src={pig} alt="pig" width="350" height="600" />
        </div>
      </MobileView>
    </div>
  );

  const pig_back = (
    <div
      onMouseLeave={() => setPigFlipped((x) => !x)}
      onClick={() => saveMap("pig")}
    >
      <img src={click_pig} alt="pig" width="350" height="600" />
    </div>
  );

  const hansel_front = (
    <div>
      <BrowserView>
        <div onMouseEnter={() => setHanselFlipped((x) => !x)}>
          <img src={hansel} alt="hansel" width="350" height="600" />
        </div>
      </BrowserView>
      <MobileView>
        <div onClick={() => setHanselFlipped((x) => !x)}>
          <img src={hansel} alt="hansel" width="350" height="600" />
        </div>
      </MobileView>
    </div>
  );

  const hansel_back = (
    <div
      onMouseLeave={() => setHanselFlipped((x) => !x)}
      onClick={() => saveMap("hansel")}
    >
      <img src={click_hansel} alt="hansel" width="350" height="600" />
    </div>
  );

  const prince_front = (
    <div>
      <BrowserView>
        <div onMouseEnter={() => setPrinceFlipped((x) => !x)}>
          <img src={prince} alt="prince" width="350" height="600" />
        </div>
      </BrowserView>
      <MobileView>
        <div onClick={() => setPrinceFlipped((x) => !x)}>
          <img src={prince} alt="prince" width="350" height="600" />
        </div>
      </MobileView>
    </div>
  );

  const prince_back = (
    <div
      onMouseLeave={() => setPrinceFlipped((x) => !x)}
      onClick={() => saveMap("prince")}
    >
      <img src={click_prince} alt="prince" width="350" height="600" />
    </div>
  );

  return (
    <Box component="section" sx={{ display: "flex" }}>
      <Container
        sx={{
          mt: 5,
          mb: 20,
          marginBottom: 40,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <FadeIn delay={100} transitionDuration={1000}>
              <Box sx={item}>
                <FlipCard
                  isFlipped={pigFlipped}
                  front={pig_front}
                  back={pig_back}
                />
              </Box>
            </FadeIn>
          </Grid>
          <Grid item xs={12} md={4}>
            <FadeIn delay={500} transitionDuration={1000}>
              <Box sx={item}>
                <FlipCard
                  isFlipped={hanselFlipped}
                  front={hansel_front}
                  back={hansel_back}
                />
              </Box>
            </FadeIn>
          </Grid>
          <Grid item xs={12} md={4}>
            <FadeIn delay={900} transitionDuration={1000}>
              <Box sx={item}>
                <FlipCard
                  isFlipped={princeFlipped}
                  front={prince_front}
                  back={prince_back}
                />
              </Box>
            </FadeIn>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PigStory;
