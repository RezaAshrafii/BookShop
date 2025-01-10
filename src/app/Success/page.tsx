"use client";
import React, { useEffect, useState } from "react";
import { Button, Typography, Paper, Divider, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  MdCheckCircle,
  MdShoppingCart,
  MdDateRange,
  MdLocalShipping,
} from "react-icons/md";

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    orderDate: "",
    totalAmount: 0,
    items: [],
  });

  useEffect(() => {
    // در اینجا می‌توانید اطلاعات سفارش را از API یا localStorage دریافت کنید
    // برای این مثال، ما از داده‌های نمونه استفاده می‌کنیم
    const mockOrderDetails = {
      orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      orderDate: new Date().toLocaleDateString("fa-IR"),
      totalAmount: Math.floor(Math.random() * 1000000) + 100000,
      items: [
        { name: "کتاب 1", quantity: 2, price: 50000 },
        { name: "کتاب 2", quantity: 1, price: 75000 },
      ],
    };
    setOrderDetails(mockOrderDetails);
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper className="p-6 bg-white rounded-lg shadow-xl w-full max-w-2xl text-center">
        <MdCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <Typography variant="h4" className="font-bold mb-4 text-green-600">
          پرداخت موفق
        </Typography>
        <Typography variant="body1" className="mb-6">
          از خرید شما متشکریم. سفارش شما با موفقیت ثبت شد.
        </Typography>

        <Divider className="my-4" />

        <Box className="text-left mb-6">
          <Typography variant="h6" className="font-bold mb-2 flex items-center">
            <MdShoppingCart className="mr-2" /> جزئیات سفارش
          </Typography>
          <Typography>
            <strong>شماره سفارش:</strong> {orderDetails.orderId}
          </Typography>
          <Typography className="flex items-center">
            <MdDateRange className="mr-2" /> <strong>تاریخ سفارش:</strong>{" "}
            {orderDetails.orderDate}
          </Typography>
          <Typography>
            <strong>مبلغ کل:</strong>{" "}
            {orderDetails.totalAmount.toLocaleString()} تومان
          </Typography>
        </Box>

        <Box className="text-left mb-6">
          <Typography variant="h6" className="font-bold mb-2">
            اقلام سفارش:
          </Typography>
          {orderDetails.items.map((item, index) => (
            <Typography key={index}>
              {item.name} - تعداد: {item.quantity} - قیمت:{" "}
              {item.price.toLocaleString()} تومان
            </Typography>
          ))}
        </Box>

        <Box className="text-left mb-6">
          <Typography variant="h6" className="font-bold mb-2 flex items-center">
            <MdLocalShipping className="mr-2" /> اطلاعات ارسال
          </Typography>
          <Typography>سفارش شما طی 3-5 روز کاری ارسال خواهد شد.</Typography>
          <Typography>
            لطفاً ایمیل خود را برای دریافت کد رهگیری بررسی کنید.
          </Typography>
        </Box>

        <Divider className="my-4" />

        <Box className="flex justify-between">
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/")}
            className="mt-4"
          >
            بازگشت به صفحه اصلی
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/Orders")}
            className="mt-4"
          >
            مشاهده سفارش‌ها
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default SuccessPage;
