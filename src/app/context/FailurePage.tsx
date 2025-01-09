"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Typography, Button } from "@mui/material";
import { MdError } from "react-icons/md";

const FailurePage: React.FC = () => {
  const router = useRouter();

  const tryAgain = () => {
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <MdError size={80} className="text-red-500 mb-4" />
      <Typography variant="h4" className="font-bold mb-2">
        سفارش شما ثبت نشد
      </Typography>
      <Typography variant="body1" className="text-gray-600 mb-6">
        مشکلی در ثبت سفارش شما به وجود آمده است. لطفاً دوباره تلاش کنید.
      </Typography>
      <Button variant="contained" color="secondary" onClick={tryAgain}>
        تلاش مجدد
      </Button>
    </div>
  );
};

export default FailurePage;
