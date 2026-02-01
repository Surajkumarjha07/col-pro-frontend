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
        const response = await axios.get("http://localhost:4000/api/order", {
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
      <div className="flex flex-col justify-center items-center gap-12 w-full my-8">
        <div className="flex flex-col justify-center items-start gap-8 w-3/4">
          <p className="text-gray-800 font-semibold text-3xl">Orders</p>
          {orders.length > 0 ? (
            orders.map((order) => <OrdersComponent order={order} />)
          ) : (
            <p className="text-center text-4xl text-gray-800 font-semibold">No order</p>
          )}
        </div>
      </div>
    </>
  );
}
