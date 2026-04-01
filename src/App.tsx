import { Outlet } from "react-router";

import Footer from "./components/Footer";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
