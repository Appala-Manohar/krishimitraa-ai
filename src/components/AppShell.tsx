import { Link, useLocation } from "react-router-dom";
import { Sprout, Bot, FlaskConical, BadgeIndianRupee, Landmark, LayoutDashboard, LogOut } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Disease Detection", path: "/disease-detection", icon: <Sprout size={20} /> },
    { name: "AI Krishi Doctor", path: "/chat", icon: <Bot size={20} /> },
    { name: "Fertilizer Calculator", path: "/fertilizer-calc", icon: <FlaskConical size={20} /> },
    { name: "Market Prices", path: "/market-prices", icon: <BadgeIndianRupee size={20} /> },
    { name: "Government Schemes", path: "/schemes", icon: <Landmark size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-green-900 text-white flex flex-col border-r border-green-800">
        <div className="p-6 border-b border-green-800">
          <h1 className="text-2xl font-extrabold tracking-wide text-white">🌾 KrishiMitra AI</h1>
          <p className="text-xs text-green-300 mt-1">Smart Agriculture Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-700 text-white shadow-md"
                    : "text-green-200 hover:bg-green-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-800">
          <Link
            to="/auth"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-300 hover:bg-red-900/40 hover:text-red-200 transition"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}