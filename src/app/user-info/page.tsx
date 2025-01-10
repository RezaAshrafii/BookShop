"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    address: "",
  });
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserId(parsedData._id);
    } else {
      console.log("No user data found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        setLoading(true);
        try {
          console.log("Fetching user data for userId:", userId);
          const response = await fetch(
            `http://localhost:8000/api/users/${userId}`
          );

          if (response.ok) {
            const result = await response.json();
            console.log("Fetched user data:", result);
            if (result.status === "success") {
              setFormData({
                firstname: result.data.user.firstname,
                lastname: result.data.user.lastname,
                phoneNumber: result.data.user.phoneNumber,
                address: result.data.user.address,
              });
            } else {
              console.error("Error: Invalid data or status not success.");
            }
          } else {
            console.error("Error: Response not OK", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setDeliveryDate(date);
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (deliveryDate) {
      localStorage.setItem("deliveryDate", deliveryDate.format("YYYY-MM-DD"));
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("اطلاعات با موفقیت به‌روزرسانی شد.");
      } else {
        alert("خطا در به‌روزرسانی اطلاعات.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleProceedToPayment = () => {
    router.push("/payment");
  };

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">فرم اطلاعات کاربر</h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <TextField
          label="نام"
          variant="outlined"
          fullWidth
          name="firstname"
          value={formData.firstname}
          onChange={handleInputChange}
          InputLabelProps={{ className: "text-right" }}
        />
        <TextField
          label="نام خانوادگی"
          variant="outlined"
          fullWidth
          name="lastname"
          value={formData.lastname}
          onChange={handleInputChange}
          InputLabelProps={{ className: "text-right" }}
        />
        <TextField
          label="شماره تلفن"
          variant="outlined"
          fullWidth
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          InputLabelProps={{ className: "text-right" }}
        />
        <TextField
          label="آدرس"
          variant="outlined"
          fullWidth
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          InputLabelProps={{ className: "text-right" }}
        />
        <div>
          <label className="block mb-2 text-right">تاریخ تحویل:</label>
          <DatePicker
            value={deliveryDate}
            onChange={handleDateChange}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            inputClass="w-full p-2 border rounded text-right"
            placeholder="انتخاب تاریخ"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="bg-blue-500 hover:bg-blue-600 text-white mb-2"
        >
          ثبت اطلاعات
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={handleProceedToPayment}
        >
          تایید اطلاعات و رفتن به صفحه پرداخت
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
