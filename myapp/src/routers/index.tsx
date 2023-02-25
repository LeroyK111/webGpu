import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../page/error-page";
import Page2D from "../page/page2D";
import Page3D from "../page/page3D";
import PageGis from "../page/gis";
import PageNum from "../page/numbers";
import PageGame from "../page/game"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "page2D",
        element: <Page2D></Page2D>,
      },
      {
        path: "page3D",
        element: <Page3D></Page3D>,
      },
      {
        path: "gis",
        element: <PageGis></PageGis>,
      },
      {
        path: "numbers",
        element: <PageNum></PageNum>,
      },
      {
        path: "game",
        element: <PageGame></PageGame>,
      },
    ],
  },
]);

export default router;
