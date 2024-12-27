import React from "react";
import { Button, TextField } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1120] text-white py-10 rtl">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ستون اول */}
        <div>
          <h2 className="text-2xl font-bold mb-4">کتاب دات کام</h2>
          <p className="text-sm text-gray-400 mb-4">
            جدیدترین و بهترین کتاب‌ها را با ما کشف کنید. کتاب‌های پرفروش و نویسندگان برجسته در انتظار شما هستند.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            به جمع <span className="font-bold">110,791,448,19</span> نفر عضو خبرنامه بپیوندید.
          </p>
          <div className="flex items-center gap-2">
            <TextField
              placeholder="ایمیل شما"
              variant="outlined"
              size="small"
              className="bg-white rounded-lg flex-grow"
            />
            <Button
              variant="contained"
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <FaArrowRight />
            </Button>
          </div>
        </div>

        {/* ستون دوم */}
        <div>
          <h3 className="text-lg font-bold mb-4">آنچه ارائه می‌دهیم</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>عضویت</li>
            <li>فروش کتاب‌ها</li>
            <li>فروش مجموعه‌ها</li>
            <li>لینک نمونه</li>
            <li>دوره‌های آموزشی</li>
            <li>لینک دیگر</li>
          </ul>
        </div>

        {/* ستون سوم */}
        <div>
          <h3 className="text-lg font-bold mb-4">منابع</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>مرکز راهنما</li>
            <li>راهنماهای کاربری</li>
            <li>بلاگ</li>
            <li>نظرات کاربران</li>
            <li>تماس با ما</li>
          </ul>
        </div>

        {/* ستون چهارم */}
        <div>
          <h3 className="text-lg font-bold mb-4">بین‌المللی</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>پاکستان</li>
            <li>استرالیا</li>
            <li>برزیل</li>
            <li>کانادا</li>
            <li>فرانسه</li>
            <li>هند</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-400">
        © 2023 کتاب دات کام. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
};

export default Footer;
