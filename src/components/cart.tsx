import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CartComponent({
  handlePayment,
  decreaseQty,
  increaseQty,
  removeItem,
  product,
}: any) {
  return (
    <>
      <div
        key={product.productId}
        className="flex gap-4 p-4 border rounded-xl shadow-sm"
      >
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${product.productImage}`}
          alt={product.productName}
          width={120}
          height={120}
          className="rounded-lg object-cover"
        />

        <div>
          <h2 className="text-lg font-medium">{product.productName}</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="font-semibold mt-1">₹{product.price}</p>

          <div className="flex justify-start items-center gap-2 mt-3">
            <button
              onClick={() => decreaseQty(product._id)}
              className="p-2 border rounded-md hover:bg-gray-100"
            >
              <FiMinus size={16} />
            </button>

            <span className="w-8 text-center">{product.quantity}</span>

            <button
              onClick={() => increaseQty(product._id)}
              className="p-2 border rounded-md hover:bg-gray-100"
            >
              <FiPlus size={16} />
            </button>

            <button
              onClick={() => removeItem(product._id)}
              className="ml-4 p-2 border rounded-md text-red-600 hover:bg-red-50"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
