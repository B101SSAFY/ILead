import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import ScrollToTop from "./modules/components/ScrollToTop";
import ScrollToTopPage from "./modules/components/ScrollToTopPage";

declare global {
  interface Window {
    kakao: any;
  }
}
function App() {
  return (
    <BrowserRouter>
      <ScrollToTopPage />
      <Router />
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
