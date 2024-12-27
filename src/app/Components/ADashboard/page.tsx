"use client";
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiClipboard,
  FiLayers,
} from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import CategoryManager from "../CategoryManager/CategoryManager";
import ProductManager from "../products/page";
import Inventory from "../Inventory/page";
import Orders from "../Orders/page";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AdminDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("category");
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setHasAccess(false);
    }
  }, []);

  const Sidebar = () => (
    <div className="w-64 bg-green-600 text-white h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">مدیریت</h2>
      <ul className="flex-1 space-y-4">
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === "category"
              ? "bg-green-700"
              : "hover:bg-green-700"
          }`}
          onClick={() => setSelectedSection("category")}
        >
          <FiLayers className="mr-2" /> دسته‌بندی‌ها
        </li>
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === "products"
              ? "bg-green-700"
              : "hover:bg-green-700"
          }`}
          onClick={() => setSelectedSection("products")}
        >
          <FiPackage className="mr-2" /> کالاها
        </li>
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === "orders" ? "bg-green-700" : "hover:bg-green-700"
          }`}
          onClick={() => setSelectedSection("orders")}
        >
          <FiShoppingCart className="mr-2" /> سفارشات
        </li>
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === "inventory"
              ? "bg-green-700"
              : "hover:bg-green-700"
          }`}
          onClick={() => setSelectedSection("inventory")}
        >
          <FiClipboard className="mr-2" /> موجودی و قیمت
        </li>
      </ul>
      <div className="border-t border-green-400 pt-4 mt-4">
        <p className="text-sm">مدیر</p>
        <p className="text-sm text-green-200">admin@example.com</p>
      </div>
    </div>
  );

  const ContentArea = () => {
    if (!hasAccess) {
      return (
        <div className="flex justify-center items-center w-full h-screen bg-gray-50">
          <div className="text-center p-6 bg-white shadow-md rounded-md max-w-lg">
            <AiOutlineCloseCircle className="text-6xl text-red-600 mx-auto" />
            <h2 className="text-xl font-semibold text-red-600 mt-4">
              دسترسی غیرمجاز
            </h2>
            <p className="mt-4 text-gray-700">
              شما نمی‌توانید به این بخش دسترسی پیدا کنید. لطفاً وارد حساب کاربری
              خود شوید.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      );
    }

    const renderContent = () => {
      switch (selectedSection) {
        case "category":
          return <CategoryManager />;
        case "products":
          return <ProductManager />;
        case "orders":
          return <Orders />;
        case "inventory":
          return <Inventory />;
        default:
          return (
            <div className="text-center text-gray-700">
              لطفاً یک بخش از منو انتخاب کنید.
            </div>
          );
      }
    };

    return (
      <div className="flex-1 bg-white p-8">
        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {hasAccess && <Sidebar />}
      <ContentArea />
    </div>
  );
};

export default AdminDashboard;
