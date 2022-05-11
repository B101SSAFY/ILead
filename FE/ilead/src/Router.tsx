import { Route, Routes } from "react-router-dom";
import Main from "./page/Main";
import Map from "./page/Map";
import Play from "./page/Play";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/map" element={<Map />} />
      <Route path="/play" element={<Play />} />
    </Routes>
  );
}

export default Router;
