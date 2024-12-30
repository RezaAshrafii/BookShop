"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Button,
  CircularProgress,
  Paper,
  Rating,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AiOutlineShoppingCart } from "react-icons/ai"; // استفاده از آیکون‌ها
import Header from "@/app/Components/Navbar";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    icon: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
  brand: string;
  quantity: number;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // وضعیت برای مدیریت مودال تایید
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product details");
      const data = await response.json();
      setProduct(data.data.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productInCart = cart.find((item: any) => item.product === product._id);

    if (productInCart) {
      productInCart.count += 1; // افزایش تعداد اگر محصول در سبد خرید موجود است
    } else {
      cart.push({ product: product._id, count: 1 }); // افزودن محصول جدید به سبد خرید
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setOpenModal(false); // بستن مودال
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product); // محصول انتخاب شده را ذخیره می‌کنیم
    setOpenModal(true); // نمایش مودال
  };

  const handleCloseModal = () => {
    setOpenModal(false); // بستن مودال بدون افزودن به سبد خرید
    setSelectedProduct(null); // پاک کردن محصول انتخاب شده
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10">
        <Typography variant="h5" color="error">
          محصول یافت نشد!
        </Typography>
      </div>
    );
  }

  return <>
  <Header />
    <div className="p-6 flex justify-center bg-green-50 min-h-screen">
      <Paper elevation={6} className="p-8 max-w-4xl w-full bg-white shadow-xl rounded-lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* تصویر محصول */}
          <div className="md:w-1/2">
            <img
              src={`http://localhost:8000/images/products/thumbnails/${product.thumbnail}`}
              alt={product.name}
              className="rounded-md w-full object-cover"
            />
          </div>

          {/* اطلاعات محصول */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <Typography variant="h4" className="text-green-600 font-semibold">
              {product.name}
            </Typography>
            <Typography variant="h6" className="text-gray-800">
              قیمت: {product.price.toLocaleString()} تومان
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              {product.description}
            </Typography>
            <div className="flex gap-2 flex-wrap">
              <Chip label={`برند: ${product.brand}`} color="primary" className="bg-green-200 text-green-800" />
              <Chip label={`دسته‌بندی: ${product.category.name}`} color="secondary" className="bg-green-300 text-green-900" />
              <Chip label={`زیرمجموعه: ${product.subcategory.name}`} variant="outlined" className="border-green-500 text-green-500" />
            </div>
            <Typography variant="body2" className="text-gray-700">
              تعداد موجودی: {product.quantity}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="body1" className="text-gray-800">
                امتیاز:
              </Typography>
              <Rating value={product.rating.rate} precision={0.5} readOnly />
              <Typography variant="caption" className="text-gray-500">
                ({product.rating.count} نظر)
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AiOutlineShoppingCart />}
              onClick={() => handleOpenModal(product)} // نمایش مودال تایید
            >
              اضافه به سبد خرید
            </Button>
          </div>
        </div>

        {/* تصاویر بیشتر محصول */}
        {product.images && product.images.length > 0 && (
          <div className="mt-6">
            <Typography variant="h6" className="text-gray-700 mb-4">
              تصاویر بیشتر:
            </Typography>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:8000/images/products/images/${image}`}
                  alt={`تصویر ${index + 1}`}
                  className="rounded-md object-cover w-full h-32"
                />
              ))}
            </div>
          </div>
        )}
      </Paper>
      
      {/* مودال تایید */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>تأیید اضافه به سبد خرید</DialogTitle>
        <DialogContent>
          <Typography>
            آیا می‌خواهید محصول "{selectedProduct?.name}" را به سبد خرید خود اضافه کنید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            لغو
          </Button>
          <Button
            onClick={() => {
              if (selectedProduct) {
                addToCart(selectedProduct);
              }
            }}
            color="secondary"
          >
            بله، اضافه کن
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>;
};

export default ProductDetail;
