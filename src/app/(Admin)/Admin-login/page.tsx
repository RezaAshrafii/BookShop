"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      if (response.data.status === "success") {
        const { accessToken, refreshToken } = response.data.token;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const { user } = response.data.data;
        localStorage.setItem("user", JSON.stringify(user));

        router.push("/Admin/Admin-Dashboard");
      } else {
        setError("نام کاربری یا کلمه عبور اشتباه است.");
      }
    } catch (error) {
      console.error("خطا در لاگین:", error);
      setError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center h-screen bg-green-50 shadow-lg">
      <Box className="w-5/12">
        <Image
          src="/img/Book.jpg"
          width={600}
          height={700}
          alt="کتابخانه"
          className="rounded-lg shadow-xl"
        />
      </Box>
      <Box
        component="form"
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-5/12 h-4/6"
        sx={{
          boxShadow: 3,
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          className="text-green-600 font-bold mb-6"
        >
          ورود به حساب کاربری
        </Typography>

        {error && (
          <Typography
            variant="body2"
            color="error"
            align="center"
            className="mb-4"
          >
            {error}
          </Typography>
        )}

        <Typography variant="body1" className="block mb-2 text-green-700">
          نام کاربری
        </Typography>
        <TextField
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          fullWidth
          variant="outlined"
          className="mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f1f1f1",
            },
          }}
        />

        <Typography variant="body1" className="block mb-2 text-green-700">
          رمز عبور
        </Typography>
        <Box className="relative mb-4">
          <TextField
            type={showPassword ? "text" : "password"}
            placeholder="رمز عبور خود را وارد کنید"
            fullWidth
            variant="outlined"
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f1f1f1",
                paddingLeft: "44px",
              },
            }}
          />
          <Box
            className="absolute top-4 right-3 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-600" size={20} />
            ) : (
              <FaEye className="text-gray-600" size={20} />
            )}
          </Box>
        </Box>

        <FormControlLabel
          control={<Checkbox />}
          label="به خاطر سپردن"
          className="mb-4"
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          className="py-2 text-lg"
          disabled={loading}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </Button>
        <div className="flex flex-col gap-5 mt-8">
          <Typography
            variant="body2"
            className="text-gray-500 mt-6 text-center"
          >
            رمز خود را فراموش کرده‌اید؟{" "}
            <a href="#" className="text-green-500 underline">
              اینجا کلیک کنید
            </a>
          </Typography>

          <Typography
            variant="body2"
            className="text-gray-500 mt-6 text-center"
          >
            ثبت نام نکرده‌اید؟{" "}
            <a href="#" className="text-green-500 underline">
              ساخت حساب
            </a>
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default AdminLoginPage;
