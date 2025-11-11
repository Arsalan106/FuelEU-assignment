import React, { useState } from "react";
import { Menu, Route as RouteIcon, Scale, Building, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [active, setActive] = useState("Routes");
  const navigate = useNavigate();

  const linkClasses = (tab: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${active === tab ? "bg-blue-600 text-white" : "hover:bg-blue-400 text-gray-200"}`;

  return (
    <div className="bg-black min-h-screen w-[15%] text-white flex flex-col p-4 gap-6">
      <div className="flex gap-2 text-2xl font-bold items-center">
        <Menu className="text-white" size={20} />
        <h1>
          Fuel<span className="text-blue-500 font-semibold">EU</span>
        </h1>
      </div>
      <hr className="border-gray-700" />
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={() => {
            setActive("Routes");
            navigate("/");
          }}
          className={linkClasses("Routes")}
        >
          <RouteIcon size={18} /> <span>Routes</span>
        </button>

        <button
          onClick={() => {
            setActive("Compare");
            navigate("/compare");
          }}
          className={linkClasses("Compare")}
        >
          <Scale size={18} /> <span>Compare</span>
        </button>

        <button
          onClick={() => {
            setActive("Banking");
            navigate("/banking");
          }}
          className={linkClasses("Banking")}
        >
          <Building size={18} /> <span>Banking</span>
        </button>

        <button
          onClick={() => {
            setActive("Pooling");
            navigate("/pooling");
          }}
          className={linkClasses("Pooling")}
        >
          <Users size={18} /> <span>Pooling</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
