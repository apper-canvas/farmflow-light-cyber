import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "@/components/organisms/SideMenu";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <Header onToggleSideMenu={toggleSideMenu} />
      <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
      
      <main className="pb-20 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
