import { Route, Routes } from "react-router-dom";
import Main from "./page/Main";
import Map from "./page/Map";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/map" element={<Map />} />
    </Routes>
  );
}

export default Router;
