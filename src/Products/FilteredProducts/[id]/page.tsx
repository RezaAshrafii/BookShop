"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import Header from "@/app/Components/Navbar";

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
}

interface Category {
  _id: string;
  name: string;
}

const FilteredProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const params = useParams();
  const categoryId = params?.id;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryResponse = await axios.get(
          `http://localhost:8000/api/categories/${categoryId}`
        );
        setCategory(categoryResponse.data.data.category);
      } catch (err) {
        setError("مشکلی در دریافت اطلاعات دسته‌بندی پیش آمد.");
      }
    };

    const fetchProducts = async (page: number, sortField: string) => {
      setLoading(true);
      try {
        let url = `http://localhost:8000/api/products?page=${page}`;

        if (sortField) {
          url += `&fields=${sortField}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        const fetchedProducts = data.data.products;

        const validProducts = fetchedProducts.filter(
          (product: any) => product.price !== undefined
        );

        setProducts(validProducts);
        setHasMore(fetchedProducts.length > 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    fetchProducts(page, sortField);
  }, [categoryId, page, sortField]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleProductClick = (productId: string) => {
    console.log(`Product clicked: ${productId}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <Header />
      <div className="p-4 bg-gray-100 rounded-lg shadow-md h-[91vh] mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          محصولات دسته‌بندی {category ? category.name : categoryId}
        </h2>

        <Box className="flex justify-start mb-6 gap-4 w-full">
          <FormControl variant="outlined" className="w-1/6">
            <InputLabel>مرتب‌سازی بر اساس</InputLabel>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              label="مرتب‌سازی بر اساس"
            >
              <MenuItem value="">بدون مرتب‌سازی</MenuItem>
              <MenuItem value="price">قیمت</MenuItem>
              <MenuItem value="-rating">امتیاز</MenuItem>
              <MenuItem value="-createdAt">تاریخ ایجاد</MenuItem>
              <MenuItem value="-updatedAt">تاریخ به‌روزرسانی</MenuItem>
              <MenuItem value="name">نام</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {products.length > 0 ? (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Paper
                  elevation={3}
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white rounded-lg"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={`http://localhost:8000/images/products/thumbnails/${product.thumbnail}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <Typography
                    variant="h6"
                    className="text-green-800 font-semibold"
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mb-2"
                  >
                    قیمت:
                    {product.price
                      ? product.price.toLocaleString()
                      : "قیمت نامشخص"}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<AiOutlineEye />}
                    href={`/Products/${product._id}`}
                  >
                    مشاهده جزئیات
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p className="text-center text-gray-600">
            محصولی برای این دسته‌بندی موجود نیست.
          </p>
        )}

        <Box className="flex justify-center mt-6 gap-4">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            صفحه قبلی
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handlePageChange(page + 1)}
            disabled={products.length < 10}
          >
            صفحه بعدی
          </Button>
        </Box>
      </div>
    </>
  );
};

export default FilteredProducts;
