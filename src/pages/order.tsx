import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "../redux/hooks";
import OrdersComponent from "../components/order";

export default function Order() {
  const { token } = useAppSelector((state) => state.User);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log("ORDER RESPONSE:::::::::::: ", response.data.data);
          setOrders(response.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data.data ??
            error.response?.data.message ??
            "Internal server error";
          toast.error(message);
        }
      }
    })();
  }, [token]);

  return (
    <>
    <section className="flex flex-col flex-1 justify-start items-center">
        <div className="flex flex-col justify-start items-start gap-8 w-full max-w-5xl mx-auto my-8 flex-1">
          <p className="text-gray-800 font-semibold text-3xl">Orders</p>
          {orders.length > 0 ? (
            orders.map((order) => <OrdersComponent order={order} />)
          ) : (
            <div className="flex flex-1 w-full justify-center items-center">
            <p className="text-center text-3xl text-gray-800 font-semibold">No orders</p>
            </div>
          )}
        </div>
          </section>
    </>
  );
}
