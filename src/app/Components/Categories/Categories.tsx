"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CircularProgress, Box } from "@mui/material";
import { MdCategory } from "react-icons/md";

interface Category {
  _id: string;
  name: string;
  icon: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        const fetchedCategories = data?.data?.categories;
        if (Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories);
        } else {
          setError("داده‌های دسته‌بندی‌ها به درستی دریافت نشدند");
        }
      } catch (err) {
        setError("خطا در دریافت دسته‌بندی‌ها");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500">دسته‌بندی موجود نیست</div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-green-600 text-center mb-6">
        دسته‌بندی کتاب‌های کتابخانه
      </h2>
      <div className="flex flex-wrap justify-center gap-8 p-8">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/Products/FilteredProducts/${category._id}`}
            className="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-gray-50 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-200">
              {category.icon ? (
                <img
                  src={`http://localhost:8000/images/categories/icons/${category.icon}`}
                  alt={category.name}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <MdCategory className="text-green-500 text-3xl" />
              )}
            </div>
            <span className="mt-3 text-base font-semibold text-gray-800">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
