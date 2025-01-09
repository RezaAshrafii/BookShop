import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // برای ارسال کوکی‌ها به سرور
});

// تابع برای رفرش کردن Access Token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    const response = await axios.post('/auth/token', { refreshToken });

    const { accessToken } = response.data.token;

    // ذخیره Access Token جدید در کوکی
    Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });

    return accessToken;
  } catch (error) {
    console.error('خطا در تجدید توکن:', error);
    return null;
  }
};

// Interceptor برای افزودن Access Token به درخواست‌ها
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای پاسخ‌ها: در صورت خطای 401، رفرش توکن انجام شود
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const accessToken = await refreshAccessToken();

      if (accessToken) {
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(error.config);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
