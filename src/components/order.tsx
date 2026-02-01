export default function OrdersComponent({ order }: any) {
  const productImage =
    order.products?.[0].product.productImage ||
    "https://via.placeholder.com/80";

  console.log("ORDER::::::: ", order.products?.[0].product.productImage);

  return (
      <div className="w-full flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        {/* Product Image */}
        <div className="h-40 w-40 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={`http://localhost:4000/${productImage}`}
            alt="Product"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Top */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Order #{order.orderId}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold bg-green-200 text-green-700`}
            >
              Paid
            </span>
          </div>

          {/* Bottom */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <p>{order.totalItems} item(s)</p>
            <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
          </div>
        </div>
      </div>
  );
}
