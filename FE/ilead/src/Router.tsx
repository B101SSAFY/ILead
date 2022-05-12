import { Route, Routes } from "react-router-dom";
import Main from "./page/Main";
import Play from "./page/Play";
import NotFound from "./page/NotFound";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/play" element={<Play />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
