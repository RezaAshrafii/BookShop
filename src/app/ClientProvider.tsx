// components/ClientProvider.tsx

"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { ReactNode, JSX } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme"; // مسیر فایل theme خود را بررسی کنید
import { ThemeProvider } from "./context/ThemeContext"; // اضافه کردن ThemeProvider

// ایجاد cache برای RTL
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// تعریف نوع برای props
interface ClientProviderProps {
  children: ReactNode;
}

// کامپوننت ClientProvider
export default function ClientProvider({ children }: ClientProviderProps): JSX.Element {
  return (
    <CacheProvider value={cacheRtl}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeProvider>{children}</ThemeProvider> {/* استفاده از ThemeProvider برای context */}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
