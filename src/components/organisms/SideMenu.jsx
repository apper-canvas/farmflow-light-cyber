import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SideMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "", icon: "LayoutDashboard" },
    { name: "Crops", path: "crops", icon: "Sprout" },
    { name: "Farms", path: "farms", icon: "MapPin" },
    { name: "Finances", path: "finances", icon: "DollarSign" },
    { name: "Tasks", path: "tasks", icon: "CheckSquare" },
    { name: "Weather", path: "weather", icon: "CloudRain" },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Sprout" size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-primary">FarmFlow</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                (item.path === "" && location.pathname === "/") ||
                (item.path !== "" && location.pathname.startsWith(`/${item.path}`));

              return (
                <li key={item.name}>
                  <Link
                    to={`/${item.path}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2024 FarmFlow
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;