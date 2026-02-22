import { useEffect, useMemo, useState } from "react";
import { BiPlus } from "react-icons/bi";
import Search from "../components/Search";
import ProductCard from "../components/productCard";
import ProductUpload from "../components/productUpload";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../redux/hooks";
import { toast } from "sonner";
import Switch from "@mui/material/Switch";
import Pagination from "@mui/material/Pagination";
import { debounce } from "lodash";

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
  const [loading, setLoading] = useState(false);

  const handleGetAllProducts = async () => {
    setLoading(true);
    setProducts([]);
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
    } finally {
      setLoading(false);
    }
  };

  const handleGetCreatedProducts = async () => {
    setLoading(true);
    setProducts([]);
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
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data?.message ??
          error.response?.data.data ??
          "Internal server error!";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || searchQuery.trim() !== "") return;

    if ((user as any).role === "seller" && fetchCreatedProducts) {
      handleGetCreatedProducts();
      return;
    }

    handleGetAllProducts();
  }, [token, searchQuery, fetchCreatedProducts, user, page]);

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
    if (!productName || !description || !price || !stock || !image) {
      toast.error("Enter required fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("stock", String(stock));
      if (image) formData.append("image", image);

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
        fetchCreatedProducts
          ? handleGetCreatedProducts()
          : handleGetAllProducts();
        setOpenProductUpload(false);
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

  const searchProduct = async (
    searchQuery: string,
    page: number,
    limit: number,
  ) => {
    setLoading(true);
    setProducts([]);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/search?query=${searchQuery}&page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status == 200) {
        console.log("RESSH:: ", response);
        setProducts([]);
        setProducts(response.data.data.products);
        setTotalProducts(response.data.data.productCount);
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
    finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        if (searchQuery.trim() === "") return;
        searchProduct(searchQuery, page, limit);
      }, 500),
    [searchQuery, page],
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <section className="w-full flex flex-col flex-1 overflow-x-hidden">
      <div
        className={`flex flex-col md:flex-row md:items-center 
            ${
              (user as any).role === "seller"
                ? "md:justify-between"
                : "md:justify-end"
            } 
            gap-4 bg-white p-4 md:p-6`}
      >
        {(user as any).role === "seller" && (
          <div className="flex items-center gap-3">
            <span className="text-gray-800 font-bold text-xl md:text-2xl">
              Created Products
            </span>
            <Switch
              checked={fetchCreatedProducts}
              onChange={(e) => {
                setFetchCreatedProducts(e.target.checked);
                setShowProductOpions(false);
              }}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-4">
          <div className="w-full sm:w-auto">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          {(user as any).role === "seller" && (
            <button
              className="w-full sm:w-72 flex justify-center items-center gap-2 
                rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold 
                text-white hover:bg-gray-800 transition-colors"
              onClick={() => setOpenProductUpload(true)}
            >
              <BiPlus className="text-xl" />
              <span>New Product</span>
            </button>
          )}
        </div>
      </div>

      {products && products.length > 0 ? (
        <>
          <ProductUpload
            open={openProductUpload}
            onClose={() => setOpenProductUpload(false)}
            onUpload={handleProductUpload}
          />

          <div className="flex flex-col flex-1">
            <div className="flex flex-1 justify-center my-6 md:my-10">
              <div
                className="grid 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                xl:grid-cols-5 
                gap-6 
                w-full 
                px-4"
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
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

            <div className="my-6 md:my-10 flex justify-center px-4">
              <Pagination
                count={Math.ceil(totalProducts / limit)}
                shape="rounded"
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            </div>
          </div>
        </>
      ) : loading ? (
        <div className="flex flex-1 w-full justify-center items-center">
          <p className="text-center text-2xl md:text-3xl text-gray-800 font-semibold">
            Loading.....
          </p>
        </div>
      ) : (
        <div className="flex flex-1 w-full justify-center items-center">
          <p className="text-center text-2xl md:text-3xl text-gray-800 font-semibold">
            No Products
          </p>
        </div>
      )}
    </section>
  );
}
