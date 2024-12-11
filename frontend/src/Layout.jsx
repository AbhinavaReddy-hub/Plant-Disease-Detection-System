import NavBar from "./pages/navbar/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./pages/footer/Footer";

export default function Layout() {
  return (
    <>
      <NavBar />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1, marginTop: "60px" }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
