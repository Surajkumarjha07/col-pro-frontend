import axios from "axios";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useAppSelector } from "../redux/hooks";

interface StarRatingProps {
  productId: string;
  open: boolean;
  onClose: () => void;
}

export default function StarRating({
  productId,
  open,
  onClose,
}: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const token = useAppSelector((state) => state.User.token);

  const handleSubmit = async () => {
    if (rating === 0) return;

    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/review`, {
      productId,
      userRating: rating
    },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )

    if (response.status == 200) {
      window.location.reload();
      onClose();
    }
};

if (!open) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    {/* Modal */}
    <div className="relative w-87.5 bg-white rounded-2xl p-6 shadow-xl">

      {/* Close Icon */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
      >
        <FiX size={22} />
      </button>

      <div className="flex flex-col items-center gap-6">

        <h2 className="text-xl font-semibold">Rate Your Experience</h2>

        {/* Stars */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-4xl transition-colors duration-200 ${star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
                }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Selected Value */}
        {rating > 0 && (
          <span className="text-gray-600 font-medium">
            {rating} / 5
          </span>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-2 rounded-lg font-medium transition ${rating === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
            }`}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);
}