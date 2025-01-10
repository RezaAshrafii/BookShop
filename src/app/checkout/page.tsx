"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Typography, Paper } from "@mui/material";
import {
  FaShoppingCart,
  FaUserAlt,
  FaLock,
  FaPhoneAlt,
  FaAddressBook,
} from "react-icons/fa";

const CheckoutPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.role) {
      router.push("/user-info"); // ریدایرکت به صفحه اطلاعات کاربر
    }
  }, []);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async () => {
    setLoading(true);
    try {
      const loginResponse = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!loginResponse.ok) {
        console.error("Login failed");
        setLoading(false);
        return;
      }

      const loginDataResponse = await loginResponse.json();
      const userId = loginDataResponse.data.user._id;

      // ذخیره اطلاعات کاربر در localStorage
      localStorage.setItem("user", JSON.stringify(loginDataResponse.data.user));

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (cart.length === 0) {
        console.warn("سبد خرید خالی است.");
        setLoading(false);
        return;
      }

      const orderData = {
        user: userId,
        products: cart.map((item: any) => ({
          product: item.product,
          count: item.count,
        })),
        deliveryStatus: true,
      };

      const orderResponse = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        console.error("Order creation failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      localStorage.removeItem("cart");

      // ریدایرکت به صفحه اطلاعات کاربر یا صفحه موفقیت
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role) {
        router.push("/user-info");
      } else {
        router.push("/Success");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setLoading(true);
    try {
      const signupResponse = await fetch(
        "http://localhost:8000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!signupResponse.ok) {
        console.error("Signup failed");
        setLoading(false);
        return;
      }

      const signupData = await signupResponse.json();
      setIsLogin(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 p-4">
      <Paper className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
        {isLogin ? (
          <>
            <Typography
              variant="h4"
              className="text-center text-green-600 font-semibold mb-6"
            >
              ورود به حساب کاربری
            </Typography>
            <form className="flex flex-col gap-4">
              <TextField
                label="نام کاربری"
                name="username"
                onChange={handleLoginChange}
                fullWidth
                InputProps={{
                  startAdornment: <FaUserAlt className="text-green-600 mr-2" />,
                }}
              />
              <TextField
                label="رمز عبور"
                name="password"
                type="password"
                onChange={handleLoginChange}
                fullWidth
                InputProps={{
                  startAdornment: <FaLock className="text-green-600 mr-2" />,
                }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleLoginSubmit}
                disabled={loading}
                className="mt-4"
              >
                {loading ? "در حال ارسال..." : "ورود"}
              </Button>
            </form>
            <Typography
              variant="body2"
              className="mt-4 text-center cursor-pointer text-green-600"
              onClick={() => setIsLogin(false)}
            >
              حسابی ندارید؟ ثبت‌نام کنید
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              className="text-center text-green-600 font-semibold mb-6"
            >
              تکمیل اطلاعات سفارش
            </Typography>
            <form className="flex flex-col gap-4">
              <TextField
                label="نام"
                name="firstname"
                onChange={handleRegisterChange}
                fullWidth
                InputProps={{
                  startAdornment: <FaUserAlt className="text-green-600 mr-2" />,
                }}
              />
              <TextField
                label="نام خانوادگی"
                name="lastname"
                onChange={handleRegisterChange}
                fullWidth
                InputProps={{
                  startAdornment: <FaUserAlt className="text-green-600 mr-2" />,
                }}
              />
              <TextField
                label="نام کاربری"
                name="username"
                onChange={handleRegisterChange}
                fullWidth
                InputProps={{
                  startAdornment: <FaUserAlt className="text-green-600 mr-2" />,
                }}
              />
              <TextField
                label="رمز عبور"
                name="password"
                type="password"
                onChange={handleRegisterChange}
                fullWidth
                InputProps={{
                  startAdornment: <FaLock className="text-green-600 mr-2" />,
                }}
              />
              <TextField
                label="شماره تلفن"
                name="phoneNumber"
                onChange={handleRegisterChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <FaPhoneAlt className="text-green-600 mr-2" />
                  ),
                }}
              />
              <TextField
                label="آدرس"
                name="address"
                onChange={handleRegisterChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <FaAddressBook className="text-green-600 mr-2" />
                  ),
                }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleRegisterSubmit}
                disabled={loading}
                className="mt-4"
              >
                {loading ? "در حال ارسال..." : "ثبت‌نام و ادامه"}
              </Button>
            </form>
            <Typography
              variant="body2"
              className="mt-4 text-center cursor-pointer text-green-600"
              onClick={() => setIsLogin(true)}
            >
              قبلاً حساب ساخته‌اید؟ وارد شوید
            </Typography>
          </>
        )}
      </Paper>
    </div>
  );
};

export default CheckoutPage;
