// theme.ts
import { createTheme } from "@mui/material/styles";

// تعریف فونت محلی
import localFont from "next/font/local";

const IRANSans = localFont({
  src: "app/fonts/IRANSansWeb.woff", // مسیر به فایل داخل public
  variable: "--font-iran-sans",
  weight: "100 900",
});

const theme = createTheme({
  typography: {
    fontFamily: `var(--font-iran-sans)`,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: `var(--font-iran-sans)`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: `var(--font-iran-sans)`,
        },
      },
    },
  },
});

export default theme;
