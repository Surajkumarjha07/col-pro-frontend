import { useEffect, useState } from "react";

type ProductUpdateProps = {
  open: boolean;
  onClose: () => void;
  onUpdate?: (data: {
    newProductName: string
    newDescription: string
    newPrice: number
    newStock: number
    newImage: File | null
  }) => void;
  productData: any
};

export default function ProductUpdate({
  open,
  onClose,
  onUpdate,
  productData
}: ProductUpdateProps) {
  const [newProductName, setNewProductName] = useState(productData?.productName);
  const [newDescription, setNewDescription] = useState(productData?.description);
  const [newPrice, setNewPrice] = useState(productData?.price);
  const [newStock, setNewStock] = useState(productData?.stock);
  const [newImage, setNewImage] = useState<File | null>(productData.productImage);

  useEffect(() => {
  if (productData) {
    setNewProductName(productData.productName);
    setNewDescription(productData.description);
    setNewPrice(productData.price);
    setNewStock(productData.stock);
    setNewImage(null);
  }
}, [productData]);

  if (!open) return null;

  const handleSubmit = () => {
    onUpdate!({
      newProductName,
      newDescription,
      newPrice: Number(newPrice),
      newStock: Number(newStock),
      newImage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Update Product
          </h2>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="Product Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="Product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="₹0.00"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-600"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
