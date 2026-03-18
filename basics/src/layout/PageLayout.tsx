import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-white">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}