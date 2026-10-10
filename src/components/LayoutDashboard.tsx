import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function LayoutDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Outlet/>
      </div>
    </div>
  );
}