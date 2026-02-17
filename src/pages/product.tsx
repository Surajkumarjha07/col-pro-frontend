import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import Search from "../components/Search";
import ProductCard from "../components/productCard";
import ProductUpload from "../components/productUpload";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../redux/hooks";
import { toast } from "sonner";
import Switch from "@mui/material/Switch";
import Pagination from "@mui/material/Pagination";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openProductUpload, setOpenProductUpload] = useState(false);
  const token = useAppSelector((state) => state.User.token);
  const user = useAppSelector((state) => state.User.user);
  const [products, setProducts] = useState<any[]>([]);
  const [fetchCreatedProducts, setFetchCreatedProducts] =
    useState<boolean>(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalProducts, setTotalProducts] = useState(0);
  const [showProductOpions, setShowProductOpions] = useState(false);

  const handleGetAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      setProducts(response.data.data.products);
      setTotalProducts(response.data.data.totalCount);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data?.message ??
          error.response?.data.data ??
          "Internal server error!";
        toast.error(message);
      }
    }
  };

  const handleGetCreatedProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/by-user?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setProducts(response.data.data.products);
        setTotalProducts(response.data.data.totalCount);

        setShowProductOpions(true);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data?.message ??
          error.response?.data.data ??
          "Internal server error!";
        toast.error(message);
      }
    }
  };
  useEffect(() => {
    if (!token) return;
    if ((user as any).role === "seller" && fetchCreatedProducts) {
      handleGetCreatedProducts();
      return;
    }

    handleGetAllProducts();
  }, [token, fetchCreatedProducts, user, page]);

  const handleProductUpload = async ({
    productName,
    description,
    price,
    stock,
    image,
  }: {
    productName: string;
    description: string;
    price: number;
    stock: number;
    image: File | null;
  }) => {
    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("stock", String(stock));

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success("Product uploaded successfully!");
        if (fetchCreatedProducts) {
          handleGetCreatedProducts();
        } else {
          handleGetAllProducts();
        }
        setOpenProductUpload(false);
        return;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data?.message ??
          error.response?.data.data ??
          "Internal server error!";
        toast.error(message);
      }
    }
  };

  return (
    <>
      <section className="w-full flex flex-col flex-1">
        <div
          className={`flex items-center ${(user as any).role === "seller" ? "justify-between" : "justify-end"} bg-white p-6`}
        >
          {(user as any).role === "seller" && (
            <div className="flex justify-center items-center">
              <span className="text-gray-800 font-bold text-2xl">Created Products</span>
              <Switch
                checked={fetchCreatedProducts}
                onChange={(e) => {
                  setFetchCreatedProducts(e.target.checked);
                  setShowProductOpions(false);
                }}
              />
            </div>
          )}

          <div className="flex justify-center items-center gap-8">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {(user as any).role === "seller" && (
              <button
                className="w-72 flex justify-center items-center cursor-pointer gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                onClick={() => setOpenProductUpload(true)}
              >
                <BiPlus className="text-xl" />
                <span>New Product</span>
              </button>
            )}
          </div>
        </div>

        <ProductUpload
          open={openProductUpload}
          onClose={() => {
            setOpenProductUpload(false);
          }}
          onUpload={handleProductUpload}
        />

        <div className="flex flex-col flex-1">
          <div className="flex flex-1 justify-center my-10">
            <div className="grid grid-cols-5 gap-10">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  id={product._id}
                  productId={product.productId}
                  productName={product.productName}
                  description={product.description}
                  price={product.price}
                  image={`${import.meta.env.VITE_BACKEND_URL}/${product.productImage}`}
                  showProductOpions={showProductOpions}
                />
              ))}
            </div>
          </div>

          <div className="my-10 flex justify-center">
            <Pagination
              count={Math.ceil(totalProducts / limit)}
              shape="rounded"
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </div>
        </div>
      </section>
    </>
  );
}
