import axios from "axios";
import { useEffect } from "react"
import { toast } from "sonner";
import { useAppSelector } from "../redux/hooks";

export default function Order() {
    const {token} =  useAppSelector(state => state.User);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/order", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    console.log("ORDER RESPONSE:::::::::::: ", response);
                }
                
            } catch (error) {
                if (axios.isAxiosError(error)) {   
                    const message = error.response?.data.data ?? error.response?.data.message ?? "Internal server error";
                    toast.error(message);
                }
            }
        })();
        
    }, []);

  return (
    <>

    </>
  )
}
