"use client";
import React, { useState, useEffect } from "react";
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Box } from "@mui/material";
import { MdShoppingCart, MdDeleteForever } from "react-icons/md"; 
import { useRouter } from 'next/navigation';

interface CartProduct {
  product: string;
  count: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [products, setProducts] = useState<(CartProduct & { details: Product })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false); 
  const [productToRemove, setProductToRemove] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    setLoading(false);
  }, []);

  const getProductDetailsById = async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`);
      const data = await response.json();
      return data.data.product; 
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      const fetchedProducts = await Promise.all(
        cart.map(async (cartProduct) => {
          const productDetails = await getProductDetailsById(cartProduct.product);
          return productDetails ? { ...cartProduct, details: productDetails } : null;
        })
      );
      setProducts(fetchedProducts.filter((product) => product !== null) as (CartProduct & { details: Product })[]);
    };

    if (cart.length > 0) {
      fetchProductDetails();
    }
  }, [cart]);

  const totalPrice = products.reduce((total, product) => {
    return total + (product.details.price || 0) * product.count;
  }, 0);

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((product) => product.product !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); 
    setOpenModal(false);
  };

  const handleOpenModal = (productId: string) => {
    setProductToRemove(productId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductToRemove(null);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
        <Typography variant="h4" className="text-center font-bold mb-4 text-green-600">
          سبد خرید شما
        </Typography>

        {cart.length === 0 ? (
          <Paper className="p-6 text-center shadow-md bg-gray-50 rounded-lg">
            <MdShoppingCart size={50} className="text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500">
              سبد خرید شما خالی است
            </Typography>
            <Button variant="contained" color="success" className="mt-4 shadow-lg">
              ادامه خرید
            </Button>
          </Paper>
        ) : (
          <>
            {products.map((product) => {
              if (product && product.details) {
                return (
                  <div
                    key={product.product}
                    className="border-b border-gray-300 py-4 flex justify-between items-center mb-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={`http://localhost:8000/images/products/thumbnails/${product.details.thumbnail}`}
                        alt={product.details.name}
                        className="h-24 w-24 object-cover rounded-lg shadow-md"
                      />
                      <div>
                        <Typography variant="h6" className="text-green-700 font-semibold">{product.details.name}</Typography>
                        <Typography variant="body2" color="textSecondary" className="mt-2">{product.details.description}</Typography>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Typography className="text-lg font-semibold text-green-600">
                        {product.count} × {product.details.price.toLocaleString()} تومان
                      </Typography>
                      <Button
                        onClick={() => handleOpenModal(product.product)}
                        variant="outlined"
                        color="error"
                        startIcon={<MdDeleteForever />}
                        className="text-red-600 hover:bg-red-100"
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <Box className="border-t border-gray-300 mt-4 pt-4 text-right">
              <Typography variant="h5" className="font-semibold text-green-700">
                مجموع: {totalPrice.toLocaleString()} تومان
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              fullWidth
              className="mt-6 shadow-lg"
              onClick={handleCheckout}
            >
              نهایی کردن سفارش
            </Button>
          </>
        )}

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle className="text-green-700">آیا مطمئن هستید؟</DialogTitle>
          <DialogContent>
            <Typography>آیا می‌خواهید این محصول را از سبد خرید خود حذف کنید؟</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              انصراف
            </Button>
            <Button onClick={() => productToRemove && removeFromCart(productToRemove)} color="secondary">
              حذف
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default CartPage;
