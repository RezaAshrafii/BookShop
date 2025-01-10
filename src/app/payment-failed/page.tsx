"use client";
import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import CancelIcon from "@mui/icons-material/Cancel";

const PaymentFailed = () => {
  const router = useRouter();

  const handleReturnToCart = () => {
    router.push("/Cart");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
    >
      <CancelIcon style={{ fontSize: 100, color: "red" }} />
      <Typography variant="h4" component="h1" gutterBottom>
        پرداخت موفقیت‌آمیز نبود
      </Typography>
      <Typography variant="body1" gutterBottom>
        متأسفانه پرداخت شما با موفقیت انجام نشد. سبد خرید شما همچنان حفظ شده
        است.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleReturnToCart}
        style={{ marginTop: "20px" }}
      >
        بازگشت به سبد خرید
      </Button>
    </Box>
  );
};

export default PaymentFailed;
