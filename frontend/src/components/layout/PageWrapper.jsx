import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Root layout for React Router v6's nested-route pattern: every route
// rendered through <Outlet/> gets the Navbar/Footer for free.
export default function PageWrapper() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
