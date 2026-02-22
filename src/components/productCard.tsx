import { useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ProductUpdate from "./productUpdate";
import axios from "axios";
import { useAppSelector } from "../redux/hooks";
import { toast } from "sonner";

type ProductCardProps = {
  id: string;
  productId: string;
  image?: string;
  productName: string;
  price: number;
  description: string;
  showProductOpions: boolean;
};

export default function ProductCard({
  id,
  productId,
  image,
  productName,
  price,
  description,
  showProductOpions,
}: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const token = useAppSelector((state) => state.User.token);
  const user = useAppSelector((state) => state.User.user);
  const menuRef = useRef<HTMLDivElement>(null);
  const [productData, setProductData] = useState({});

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!openUpdateModal) return;

    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setProductData(response.data.data);
      }
    })();
  }, [openUpdateModal]);

  const handleProductUpdate = async ({
    newProductName,
    newDescription,
    newPrice,
    newStock,
    newImage,
  }: {
    newProductName: string;
    newDescription: string;
    newPrice: number;
    newStock: number;
    newImage: File | null;
  }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          newProductName,
          newDescription,
          newPrice,
          newStock,
          newImage,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success("Product updated successfully!");
        setOpenUpdateModal(false);
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ?? "Internal server error!";
        toast.error(message);
      }
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success("Product deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Internal server error!";
        toast.error(message);
      }
    }
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId: id,
          quantity: 1,
          price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("Product added to cart!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.response?.data.data ??
          "Internal server error!";
        toast.error(message);
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div
        className="w-full overflow-hidden rounded-t-xl bg-gray-100 
                      h-48 sm:h-52 md:h-56"
      >
        <img
          src={image}
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
            {productName}
          </h3>

          {(user as any).role === "seller" && showProductOpions && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <BiDotsVerticalRounded className="text-lg sm:text-xl" />
              </button>

              {open && (
                <div className="absolute right-0 z-10 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setOpenUpdateModal(true);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      handleDeleteProduct();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <ProductUpdate
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          onUpdate={handleProductUpdate}
          productData={productData}
        />

        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
          {description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ₹{price}
          </span>

          <button
            className="rounded-lg bg-black px-3 sm:px-4 py-1.5 sm:py-2 
            text-xs sm:text-sm font-semibold text-white hover:bg-gray-800"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
