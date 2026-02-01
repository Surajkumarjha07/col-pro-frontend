import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import Search from "../components/Search";
import ProductCard from "../components/productCard";
import ProductUpload from "../components/productUpload";
import axios from "axios";
import { useAppSelector } from "../redux/hooks";
import { toast } from "sonner";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openProductUpload, setOpenProductUpload] = useState(false);
  const token = useAppSelector((state) => state.User.token);
  const user = useAppSelector((state) => state.User.user);
  const [products, setProducts] = useState<any[]>([]);

  const handleGetCreatedProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/products/by-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (!token) return;
    handleGetCreatedProducts();
  }, [token]);

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
        `http://localhost:4000/api/products/create-product`,
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
        handleGetCreatedProducts();
        setOpenProductUpload(false);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ?? "Internal server error!";
        toast.error(message);
      }
    }
  };

  return (
    <>
      <section className="">
        <div className="flex items-center justify-end bg-white p-6">
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {
            (user as any).role === "seller" &&
            <button
            className="ml-4 flex items-center cursor-pointer gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            onClick={() => setOpenProductUpload(true)}
            >
            <BiPlus className="text-xl" />
            New Product
          </button>
          }
        </div>

        <ProductUpload
          open={openProductUpload}
          onClose={() => {
            setOpenProductUpload(false);
          }}
          onUpload={handleProductUpload}
        />

        <div className="flex justify-center my-10">
          <div className="grid grid-cols-5 gap-10">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                id={product._id}
                productId={product.productId}
                productName={product.productName}
                description={product.description}
                price={product.price}
                image={`http://localhost:4000/${product.productImage}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
