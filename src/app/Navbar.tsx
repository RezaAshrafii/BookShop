"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import Link from "next/link";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

const Header = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Schema validation for login and signup using Yup
  const loginValidationSchema = Yup.object({
    username: Yup.string().required("نام کاربری الزامی است"),
    password: Yup.string().required("رمز عبور الزامی است"),
  });

  const signupValidationSchema = Yup.object({
    firstname: Yup.string().required("نام الزامی است"),
    lastname: Yup.string().required("نام خانوادگی الزامی است"),
    username: Yup.string().required("نام کاربری الزامی است"),
    password: Yup.string()
      .required("رمز عبور الزامی است")
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    phoneNumber: Yup.string()
      .required("شماره موبایل الزامی است")
      .matches(/^\d{11}$/, "شماره موبایل معتبر نیست"),
    address: Yup.string().required("آدرس الزامی است"),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedAccessToken = document.cookie.replace("token=", "");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedUser && storedAccessToken && storedRefreshToken) {
        setUserInfo(JSON.parse(storedUser));
        setLoggedIn(true);

        checkAccessTokenExpiry(storedAccessToken, storedRefreshToken);
      }

      setIsClient(true);
    }
  }, []);

  const checkAccessTokenExpiry = async (accessToken, refreshToken) => {
    try {
      const expiryTime = JSON.parse(atob(accessToken.split(".")[1]))?.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (expiryTime && currentTime > expiryTime) {
        await refreshAccessToken(refreshToken);
      }
    } catch (error) {
      console.error("Error checking access token expiry:", error);
    }
  };
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.token) {
        document.cookie = `token=${data.token.accessToken}; path=/`;
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("refreshToken", data.token.refreshToken);
        setUserInfo(data.data.user);
      } else {
        console.error("Failed to refresh access token:", data.message);
        handleLogout();
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      handleLogout();
    }
  };

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenSignup = () => setOpenSignup(true);
  const handleCloseSignup = () => setOpenSignup(false);

  const handleLogin = async (values: any) => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();
      if (data.token) {
        document.cookie = `token=${data.token.accessToken}; path=/`;
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("refreshToken", data.token.refreshToken);
        setUserInfo(data.data.user);
        setLoggedIn(true);
        handleCloseLogin();
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleSignup = async (values: any) => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: values.firstname,
          lastname: values.lastname,
          username: values.username,
          password: values.password,
          phoneNumber: values.phoneNumber,
          address: values.address,
        }),
      });

      const data = await response.json();
      if (data.token) {
        document.cookie = `token=${data.token.accessToken}; path=/`;
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("refreshToken", data.token.refreshToken);
        setUserInfo(data.data.user);
        setLoggedIn(true);
        handleCloseSignup();
      }
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${document.cookie.replace("token=", "")}`,
        },
      });
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      setUserInfo(null);
      setLoggedIn(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center fixed top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600">کتاب دات کام</h1>
        <nav className="flex gap-4">
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            خانه
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            فروشگاه
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            درباره ما
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            تماس با ما
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            بلاگ‌ها
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            دسته‌بندی‌ها
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            خدمات
          </Link>
        </nav>

        <div className="flex gap-4">
          {!loggedIn ? (
            <>
              <Button
                variant="outlined"
                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                onClick={handleOpenLogin}
              >
                ورود
              </Button>
              <Button
                variant="contained"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleOpenSignup}
              >
                ثبت نام
              </Button>
              <Button
                variant="contained"
                className="bg-green-600 hover:bg-green-700"
                href={`/Admin/Admin-login`}
              >
                ورود مدیریت
              </Button>
            </>
          ) : (
            <div className="relative">
              <Button
                variant="text"
                className="text-green-600 hover:text-green-800"
              >
                <AccountCircleIcon />
                {userInfo?.firstname} {userInfo?.lastname}
              </Button>
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg">
                <Button
                  onClick={handleLogout}
                  className="w-full text-red-600 hover:bg-red-100"
                >
                  خروج
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <Modal open={openLogin} onClose={handleCloseLogin}>
        <Box className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-md w-96">
          <Typography variant="h6" className="text-center mb-4">
            ورود
          </Typography>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            <Form className="flex flex-col gap-5">
              <Field
                name="username"
                as={TextField}
                label="نام کاربری"
                fullWidth
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="username" />}
                helperText={<ErrorMessage name="username" />}
              />
              <Field
                name="password"
                as={TextField}
                label="رمز عبور"
                fullWidth
                type="password"
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="password" />}
                helperText={<ErrorMessage name="password" />}
              />
              <Button
                variant="contained"
                fullWidth
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                ورود
              </Button>
            </Form>
          </Formik>
        </Box>
      </Modal>

      <Modal open={openSignup} onClose={handleCloseSignup}>
        <Box className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-md w-96">
          <Typography variant="h6" className="text-center mb-4">
            ثبت نام
          </Typography>
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              username: "",
              password: "",
              phoneNumber: "",
              address: "",
            }}
            validationSchema={signupValidationSchema}
            onSubmit={handleSignup}
          >
            <Form className="flex flex-col gap-3">
              <Field
                name="firstname"
                as={TextField}
                label="نام"
                fullWidth
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="firstname" />}
                helperText={<ErrorMessage name="firstname" />}
              />
              <Field
                name="lastname"
                as={TextField}
                label="نام خانوادگی"
                fullWidth
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="lastname" />}
                helperText={<ErrorMessage name="lastname" />}
              />
              <Field
                name="username"
                as={TextField}
                label="نام کاربری"
                fullWidth
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="username" />}
                helperText={<ErrorMessage name="username" />}
              />
              <Field
                name="password"
                as={TextField}
                label="رمز عبور"
                fullWidth
                type="password"
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="password" />}
                helperText={<ErrorMessage name="password" />}
              />
              <Field
                name="phoneNumber"
                as={TextField}
                label="شماره موبایل"
                fullWidth
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="phoneNumber" />}
                helperText={<ErrorMessage name="phoneNumber" />}
              />
              <Field
                name="address"
                as={TextField}
                label="آدرس"
                fullWidth
                variant="outlined"
                className="mb-4"
                error={<ErrorMessage name="address" />}
                helperText={<ErrorMessage name="address" />}
              />
              <Button
                variant="contained"
                fullWidth
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                ثبت نام
              </Button>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default Header;
