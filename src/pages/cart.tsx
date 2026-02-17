import { toast } from "sonner";
import CartComponent from "../components/cart";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";

export default function Cart() {
  const [cart, setCart] = useState<any | null>(null);
  const { token } = useAppSelector((state) => state.User);
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [amount, setAmount] = useState(0);
  const user = useAppSelector((state) => state.User.user);

  const handlePayment = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/payment`,
      {
        amount,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    if (response.status === 200) {
      try {
        const { razorpay_order, payment_order } = response.data.data;

        if (razorpay_order) {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorpay_order.amount,
            currency: razorpay_order.currency,
            name: "E-Marketplace",
            description: "Payment",
            order_id: razorpay_order.id,
            handler: async function (response: any) {
              console.log("PAYMENT SUCCESS::::::::", response);

              const finalResponse = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/payment`,
                {
                  paymentId: response.razorpay_payment_id,
                  internalPaymentId: payment_order._id,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
                },
              );

              if (finalResponse.status === 200) {
                toast.success("Payment Successful!");
                try {
                  const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/order`,
                    {},
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      withCredentials: true,
                    },
                  );

                  if (response.status === 200) {
                    toast.success("Your order has been placed!");
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
              }
            },
            modal: {
              ondismiss: async () => {
                const response = await axios.put(
                  `${import.meta.env.VITE_BACKEND_URL}/api/payment`,
                  {
                    orderId: payment_order.orderId,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                  },
                );

                if (response.status === 200) {
                  toast.success("Payment cancelled!");
                }
              },
            },
            prefill: {
              name: (user as any).name,
              email: (user as any).email,
            },
            theme: {
              color: "#609af7",
            },
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        }
      } catch (error) {
        console.log(
          "ERROR IN OPENING RAZORPAY::::::::::: ",
          (error as Error).message,
        );
      }
    }
  };

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const carts = response?.data?.data?.carts;
          const products = response?.data?.data?.products;

          setCart(carts);
          setCartProducts(products);
          setAmount(carts.totalAmount);
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
    })();
  }, [token]);

  const increaseQty = async (id: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId: id,
          flag: "increase",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setCartProducts((prev: any) =>
          prev.map((item: any) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );

        const price = cartProducts.find((p: any) => p._id === id).price ?? 0;

        setCart((prev: any) => ({
          ...prev,
          totalAmount: prev.totalAmount + price,
        }));
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

  const decreaseQty = async (id: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId: id,
          flag: "decrease",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setCartProducts((prev) =>
          prev
            .map((item) =>
              item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        );

        const price = cartProducts.find((p: any) => p._id === id).price ?? 0;

        setCart((prev: any) => ({
          ...prev,
          totalAmount: prev.totalAmount - price,
        }));
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

  const removeItem = async (id: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/delete`,
      {
        productId: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    if (response.status === 200) {
      toast.success("Product removed from cart!");
      const price = cartProducts.find((p) => p._id === id).price ?? 0;
      const quantity = cartProducts.find((p) => p._id === id).quantity ?? 0;

      setCart((prev: any) => ({
        ...prev,
        totalAmount: prev.totalAmount - quantity * price,
      }));

      setCartProducts((prev) => prev.filter((item) => item._id !== id));
    }
  };

  return (
    <>
      <section className="flex flex-1">
        <div className="max-w-3xl w-full mx-auto p-4 space-y-4">
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>

          {cart && cartProducts?.map((product) => (
            <CartComponent
              handlePayment={handlePayment}
              decreaseQty={decreaseQty}
              increaseQty={increaseQty}
              removeItem={removeItem}
              product={product}
            />
          ))}

          {cart && cartProducts?.length > 0 ? (
            <>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-semibold">
                  ₹{cart?.totalAmount}
                </span>
              </div>

              <div className="flex justify-center items-center my-8">
                <button
                  className="bg-black hover:bg-gray-800 cursor-pointer px-8 py-3 text-white rounded-lg w-sm text-sm font-semibold"
                  onClick={handlePayment}
                >
                  Proceed to payment - ₹{cart.totalAmount}
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-800 font-bold text-3xl">
                Your cart is empty
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
