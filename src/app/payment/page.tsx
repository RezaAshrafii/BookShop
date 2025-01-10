"use client";
import React, { useState } from "react";
import {
  Button,
  Typography,
  Paper,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

const payment: React.FC = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleCancel = () => {
    router.push("/payment-failed");
  };
  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push("/Success");
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
        <Typography variant="h5" className="text-center mb-4">
          درگاه پرداخت بانکی
        </Typography>
        <Box className="mb-4">
          <TextField
            fullWidth
            label="شماره کارت"
            variant="outlined"
            className="mb-2"
          />
          <TextField
            fullWidth
            label="تاریخ انقضا"
            variant="outlined"
            className="mb-2"
          />
          <TextField
            fullWidth
            label="CVV2"
            variant="outlined"
            className="mb-2"
          />
          <TextField fullWidth label="رمز دوم" variant="outlined" />
        </Box>
        <Box className="flex justify-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress size={24} />
            ) : (
              "پرداخت و تکمیل خرید"
            )}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            انصراف
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default payment;
