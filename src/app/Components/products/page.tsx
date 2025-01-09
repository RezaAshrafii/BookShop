import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialProduct, setInitialProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    brand: "",
    description: "",
    thumbnail: null,
    images: [],
    category: "",
    subcategory: "",
  });

  // دریافت محصولات
  const fetchProducts = async (page: number = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products?page=${page}`
      );
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.totalPages); // فرض کنید API این مقدار را برمی‌گرداند
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // دریافت دسته‌بندی‌ها
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories");
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // دریافت تمام زیرگروه‌ها
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/subcategories"
      );
      setSubcategories(response.data.data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // فیلتر کردن زیرگروه‌ها بر اساس دسته‌بندی انتخاب‌شده
  const filterSubcategories = (categoryId: string) => {
    if (!categoryId) {
      setFilteredSubcategories([]);
      return;
    }
    const filtered = subcategories.filter(
      (subcategory) => subcategory.category === categoryId
    );
    setFilteredSubcategories(filtered);
  };

  // ارسال فرم داده‌ها برای افزودن محصول جدید
  const handleAddProduct = async () => {
    // ولیدیشن فیلدها
    if (!newProduct.name) {
      confirmAlert({
        message: "نام محصول الزامی است.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      confirmAlert({
        message: "قیمت محصول باید عددی مثبت باشد.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.quantity || newProduct.quantity <= 0) {
      confirmAlert({
        message: "تعداد محصول باید عددی مثبت باشد.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.brand) {
      confirmAlert({
        message: "برند محصول الزامی است.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.description) {
      confirmAlert({
        message: "توضیحات محصول الزامی است.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.category) {
      confirmAlert({
        message: "دسته‌بندی محصول الزامی است.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.subcategory) {
      confirmAlert({
        message: "زیرگروه محصول الزامی است.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.thumbnail) {
      confirmAlert({
        message: "تصویر پیش‌نمایش الزامی است.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }
    if (!newProduct.images) {
      confirmAlert({
        message: "تصاویر محصول الزامی است.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
      return;
    }

    // پس از موفقیت‌آمیز بودن ولیدیشن‌ها، داده‌ها به فرم ارسال می‌شود
    const formData = new FormData();

    // اضافه کردن داده‌های محصول به فرم
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("quantity", newProduct.quantity);
    formData.append("brand", newProduct.brand);
    formData.append("description", newProduct.description);

    // اگر تصویر بندانگشتی وجود دارد، آن را اضافه کن
    if (newProduct.thumbnail) {
      formData.append("thumbnail", newProduct.thumbnail);
    }

    // اضافه کردن تصاویر به فرم
    if (newProduct.images) {
      formData.append("images", newProduct.images);
    }

    // اضافه کردن دسته‌بندی و زیرمجموعه دسته‌بندی
    formData.append("category", newProduct.category);
    formData.append("subcategory", newProduct.subcategory);

    try {
      const token = Cookies.get("accessToken");

      // ارسال درخواست برای افزودن محصول جدید
      const response = await axios.post(
        "http://localhost:8000/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // نمایش پیام تأیید پس از موفقیت‌آمیز بودن عملیات
      confirmAlert({
        message: "محصول با موفقیت افزوده شد.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });

      setIsAddModalOpen(false); // بستن مودال
      fetchProducts(); // بارگذاری مجدد محصولات

      // بازنشانی فرم
      setNewProduct({
        name: "",
        price: "",
        quantity: "",
        brand: "",
        description: "",
        thumbnail: null,
        images: [],
        category: "",
        subcategory: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      confirmAlert({
        message: "خطا در اضافه کردن محصول. لطفاً دوباره تلاش کنید.",
        buttons: [
          {
            label: "باشه",
          },
        ],
      });
    }
  };

  // ارسال فرم داده‌ها برای ویرایش محصول
  const handleEditProduct = async () => {
    const formData = new FormData();

    // بررسی و اضافه کردن فقط فیلدهایی که تغییر کرده‌اند
    if (newProduct.name !== initialProduct?.name) {
      formData.append("name", newProduct.name);
    }

    if (newProduct.category !== initialProduct?.category) {
      formData.append("category", newProduct.category);
    }

    if (newProduct.price !== initialProduct?.price) {
      formData.append("price", newProduct.price);
    }

    if (newProduct.quantity !== initialProduct?.quantity) {
      formData.append("quantity", newProduct.quantity);
    }

    if (newProduct.brand !== initialProduct?.brand) {
      formData.append("brand", newProduct.brand);
    }

    if (newProduct.description !== initialProduct?.description) {
      formData.append("description", newProduct.description);
    }

    // بررسی تغییرات تصویر شاخص
    if (
      newProduct.thumbnail &&
      newProduct.thumbnail !== initialProduct?.thumbnail
    ) {
      formData.append("thumbnail", newProduct.thumbnail);
    }

    // بررسی تغییرات تصاویر اضافی
    if (newProduct.images && newProduct.images.length > 0) {
      // بررسی اینکه آیا تصاویر جدید اضافه شده‌اند
      const newImages = newProduct.images.filter(
        (image) => !initialProduct?.images.includes(image)
      );
      newImages.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const token = Cookies.get("accessToken");

      if (productToEdit) {
        await axios.patch(
          `http://localhost:8000/api/products/${productToEdit._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // بستن مودال و بازنشانی فرم
      setIsEditModalOpen(false);

      // بازخوانی محصولات
      fetchProducts();

      // بازنشانی مقادیر فرم پس از ویرایش
      setNewProduct({
        name: "",
        price: "",
        quantity: "",
        brand: "",
        description: "",
        thumbnail: null,
        images: [],
        category: "",
        subcategory: "",
      });
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  // حذف محصول
  const handleDeleteProduct = async () => {
    try {
      const token = Cookies.get("accessToken");

      if (productToDelete) {
        await axios.delete(
          `http://localhost:8000/api/products/${productToDelete._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsDeleteModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    filterSubcategories(newProduct.category);
  }, [newProduct.category]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // دکمه ویرایش محصول
  const handleEditClick = (product: any) => {
    setProductToEdit(product);
    setNewProduct({
      ...newProduct,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      brand: product.brand,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      thumbnail: product.thumbnail,
      images: product.images || [],
    });
    setInitialProduct(product); // ذخیره مقادیر اولیه محصول برای مقایسه
    setIsEditModalOpen(true);
  };

  // دکمه حذف محصول
  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">مدیریت محصولات</h1>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 flex items-center"
      >
        <FaPlus className="ml-2" /> افزودن محصول
      </button>

      {/* جدول نمایش محصولات */}
      <div className="relative h-[400px] overflow-y-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">تصویر</th>
              <th className="py-2 px-4 border-b">نام</th>
              <th className="py-2 px-4 border-b">قیمت</th>
              <th className="py-2 px-4 border-b">تعداد</th>
              <th className="py-2 px-4 border-b">برند</th>
              <th className="py-2 px-4 border-b">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={
                      `http://localhost:8000/images/products/images/${product.images[0]}` ||
                      `http://localhost:8000/images/products/images/products-images-default.jpg`
                    }
                    alt={product.name}
                    width="50px"
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.price}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.quantity}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.brand}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="text-blue-600 m-1 flex items-center"
                    onClick={() => handleEditClick(product)}
                  >
                    <FaEdit className="ml-1" /> ویرایش
                  </button>
                  <button
                    className="text-red-600 m-1 flex items-center"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <FaTrash className="ml-1" /> حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
            fetchProducts(currentPage - 1);
          }}
          className={`flex items-center px-4 py-2 mx-1 ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          <FaChevronRight className="mr-2" /> قبلی
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => {
              setCurrentPage(index + 1);
              fetchProducts(index + 1);
            }}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            fetchProducts(currentPage + 1);
          }}
          className={`flex items-center px-4 py-2 mx-1 ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          بعدی <FaChevronLeft className="ml-2" />
        </button>
      </div>

      {/* مودال افزودن محصول */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-2xl mb-4">افزودن محصول جدید</h2>
            <input
              type="text"
              placeholder="نام محصول"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="number"
              placeholder="قیمت"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="number"
              placeholder="تعداد"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="text"
              placeholder="برند"
              value={newProduct.brand}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <textarea
              placeholder="توضیحات"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            ></textarea>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={newProduct.subcategory}
              onChange={(e) =>
                setNewProduct({ ...newProduct, subcategory: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            >
              <option value="">انتخاب زیرگروه</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>

            <div className="flex gap-5 m-3">
              {/* Thumbnail Input */}
              <div className="relative">
                <input
                  id="thumbnail"
                  type="file"
                  name="thumbnail"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      thumbnail: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center border-2 border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7l9-4 9 4v12l-9 4-9-4V7z"
                    />
                  </svg>
                  <span className="ml-2 text-gray-700 text-sm">
                    انتخاب تصویر پیش‌نمایش
                  </span>
                </div>
              </div>

              {/* Product Images Input */}
              <div className="relative">
                <input
                  id="images"
                  type="file"
                  name="images"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      images: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center border-2 border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7l9-4 9 4v12l-9 4-9-4V7z"
                    />
                  </svg>
                  <span className="ml-2 text-gray-700 text-sm">
                    انتخاب تصویر محصول
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex items-center bg-red-400 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
              >
                <MdCancel className="ml-2" /> انصراف
              </button>
              <button
                onClick={handleAddProduct}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <FaPlus className="ml-2" /> افزودن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال ویرایش محصول */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-2xl mb-4">ویرایش محصول</h2>

            {/* فیلدهای ویرایش */}
            <input
              type="text"
              placeholder="نام محصول"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />

            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex gap-5 m-3">
              {/* Thumbnail Input */}
              <div className="relative">
                {/* نمایش تصویر شاخص فعلی */}
                {productToEdit && productToEdit.thumbnail && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:8000/images/products/thumbnails/${productToEdit.thumbnail}`}
                      alt="Product Thumbnail"
                      width="100px"
                    />
                    <p className="text-sm text-gray-500">تصویر شاخص فعلی</p>
                  </div>
                )}

                {/* تغییر تصویر شاخص */}
                <input
                  id="thumbnail"
                  type="file"
                  name="thumbnail"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      thumbnail: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center border-2 border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7l9-4 9 4v12l-9 4-9-4V7z"
                    />
                  </svg>
                  <span className="ml-2 text-gray-700 text-sm">
                    انتخاب تصویر پیش‌نمایش
                  </span>
                </div>
              </div>

              {/* Product Images Input */}
              <div className="relative">
                {/* نمایش تصاویر فعلی */}
                {productToEdit &&
                  productToEdit.images &&
                  productToEdit.images.length > 0 && (
                    <div className="mb-4">
                      <h3>تصاویر فعلی</h3>
                      <div className="flex gap-2">
                        {productToEdit.images.map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:8000/images/products/images/${image}`}
                            alt={`Product Image ${index + 1}`}
                            width="50px"
                            className="border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* انتخاب تصاویر جدید */}
                <input
                  id="images"
                  type="file"
                  name="images"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      images: e.target.files ? Array.from(e.target.files) : [],
                    })
                  }
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center border-2 border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7l9-4 9 4v12l-9 4-9-4V7z"
                    />
                  </svg>
                  <span className="ml-2 text-gray-700 text-sm">
                    انتخاب تصاویر محصول
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex items-center bg-red-400 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
              >
                <MdCancel className="ml-2" /> انصراف
              </button>
              <button
                onClick={handleEditProduct}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <FiEdit className="ml-2" /> ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال تایید حذف محصول */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-2xl mb-4">
              آیا از حذف "{productToDelete.name}" مطمئن هستید؟
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex items-center bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                <MdCancel className="ml-2" /> انصراف
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex items-center bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <AiOutlineCheck className="ml-2" /> تایید
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
