import axios from 'axios';
import Cookies from 'js-cookie';

// ایجاد نمونه Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // آدرس اصلی API خود را وارد کنید
  timeout: 10000, // زمان انتظار درخواست‌ها
});

// تابعی برای درخواست تجدید توکن
const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      throw new Error('Refresh token not available');
    }

    const response = await axios.post('/auth/token', { refreshToken });

    if (response.data.status === 'success') {
      const { accessToken, refreshToken: newRefreshToken } = response.data.token;

      // ذخیره توکن‌های جدید در کوکی‌ها
      Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
      Cookies.set('refreshToken', newRefreshToken, { secure: true, sameSite: 'strict' });

      return accessToken; // برگشت توکن جدید برای استفاده در درخواست‌ها
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// افزودن interceptor برای درخواست‌های Axios
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// افزودن interceptor برای پاسخ‌ها
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // اگر خطای 401 (Unauthorized) دریافت کردیم، یعنی توکن منقضی شده است
      try {
        const newAccessToken = await refreshToken();

        // تکرار درخواست با توکن جدید
        if (newAccessToken) {
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(error.config); // ارسال مجدد درخواست با توکن جدید
        }
      } catch (e) {
        console.error('Error during token refresh:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
