import React from "react";
import Sidebar from "../../../components/servers/Sidebar";
import Header from "../../../components/servers/Header";
import { Outlet } from "react-router-dom";

const ServerLayout = () => {
  return (
    <div className="font-inter flex h-screen bg-gray-50 dark:bg-gray-900">

      <Sidebar/>

      <div className="flex flex-col flex-1">
        <Header/>
        <main>
          <Outlet/>
        </main>
      </div>
      
    </div>
  );
};

export default ServerLayout;
