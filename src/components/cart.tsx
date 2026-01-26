import axios from "axios";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { useAppSelector } from "../redux/hooks";

export default function CartComponent() {
  const [cart, setCart] = useState<any | null>(null);
  const { token } = useAppSelector((state) => state.User);
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [amount, setAmount] = useState(0);

  const handlePayment = async () => {
    const response = await axios.post(
      "http://localhost:4000/api/payment",
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
            name: "Your App Name",
            description: "Payment",
            order_id: razorpay_order.id,
            handler: async function (response: any) {
              console.log("PAYMENT SUCCESS::::::::", response);
              
              const finalResponse = await axios.post("http://localhost:4000/api/payment",
                {
                  paymentId: response.razorpay_payment_id,
                  internalPaymentId: payment_order._id
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  withCredentials: true
                }
              )

              if (finalResponse.status === 200) {
                toast.success("Payment Successful!");
              }
            },
            prefill: {
              name: "Test User",
              email: "test@example.com",
            },
            theme: {
              color: "#000000",
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
        const response = await axios.get("http://localhost:4000/api/cart", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const carts = response.data.data.carts;
          const products = response.data.data.products;

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
        "http://localhost:4000/api/cart",
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
        setCartProducts((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );

        const price = cartProducts.find((p) => p._id === id).price ?? 0;

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
        "http://localhost:4000/api/cart",
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

        const price = cartProducts.find((p) => p._id === id).price ?? 0;

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
      `http://localhost:4000/api/cart/delete`,
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

  const handleOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/order",
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
        console.log("RESPINFKHKKFDH::::::::::: ", response.data);
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
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>

      {!cart && <p className="text-gray-500">Your cart is empty.</p>}

      {cartProducts?.map((item) => (
        <div
          key={item.productId}
          className="flex gap-4 p-4 border rounded-xl shadow-sm"
        >
          <img
            src={`http://localhost:4000/${item.productImage}`}
            alt={item.productName}
            width={120}
            height={120}
            className="rounded-lg object-cover"
          />

          <div className="flex-1">
            <h2 className="text-lg font-medium">{item.productName}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="font-semibold mt-1">₹{item.price}</p>

            <div className="flex justify-start items-center gap-2 mt-3">
              <button
                onClick={() => decreaseQty(item._id)}
                className="p-2 border rounded-md hover:bg-gray-100"
              >
                <FiMinus size={16} />
              </button>

              <span className="w-8 text-center">{item.quantity}</span>

              <button
                onClick={() => increaseQty(item._id)}
                className="p-2 border rounded-md hover:bg-gray-100"
              >
                <FiPlus size={16} />
              </button>

              <button
                onClick={() => removeItem(item._id)}
                className="ml-4 p-2 border rounded-md text-red-600 hover:bg-red-50"
              >
                <FiTrash2 size={16} />
              </button>

              {/* <div>
                <button className="rounded-lg bg-black w-xs px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 cursor-pointer">
                  Buy Now
                </button>
              </div> */}
            </div>
          </div>
        </div>
      ))}

      {cart && cart.products.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-lg font-medium">Total</span>
          <span className="text-xl font-semibold">₹{cart?.totalAmount}</span>
        </div>
      )}

      <div className="flex justify-center items-center my-8">
        {cart && (
          <button
            className="bg-black hover:bg-gray-800 cursor-pointer px-8 py-3 text-white rounded-lg w-sm text-sm font-semibold"
            onClick={handlePayment}
          >
            Proceed to payment - ₹{cart.totalAmount}
          </button>
        )}
      </div>
    </div>
  );
}
