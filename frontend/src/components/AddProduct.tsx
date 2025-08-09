//AddProduct.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("general"); // default type
  const [basePrice, setBasePrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const route = useNavigate();

  const [variants, setVariants] = useState([
    { size: "", color: "", price: 0.0, stock: 0, sku: "" },
  ]);
  const [addons, setAddons] = useState([
    { name: "", description: "", price: 0.0 },
  ]);

  // Add a new variant row
  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", color: "", price: 0, stock: 0, sku: "" },
    ]);
  };

  // Add a new addon row
  const addAddon = () => {
    setAddons([...addons, { name: "", description: "", price: 0.0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("basePrice", basePrice);
    if (image) formData.append("image", image);

    formData.append("variants", JSON.stringify(variants));
    if (type === "food") {
      formData.append("addons", JSON.stringify(addons));
    }

    // Send to backend
    await fetch("http://localhost:4040/api/products", {
      method: "POST",
      body: formData, // Send FormData directly
    })
      .then((res) => res.json())
      .then((data) => console.log("Product added:", data))
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 border border-gray-200"
                onClick={() => route("/")}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Catalog
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Add New Product
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Details Card */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Product Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm text-gray-900 transition-all duration-200"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="general">📱 Electronics</option>
                    <option value="food">🍕 Food</option>
                    <option value="clothing">👕 Apparel</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-500 transition-all duration-200 resize-none"
                    placeholder="Describe your product..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Base Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-500 transition-all duration-200"
                      placeholder="0.00"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                      onChange={(e) =>
                        setImage(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Variants Card */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Product Variants
                  </h2>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {variants.length} variant{variants.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-white/80 rounded-2xl border border-gray-200 shadow-sm"
                  >
                    <input
                      type="text"
                      placeholder="Size (S, M, L)"
                      value={variant.size}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[index].size = e.target.value;
                        setVariants(newVariants);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                    />

                    <input
                      type="text"
                      placeholder="Color"
                      value={variant.color}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[index].color = e.target.value;
                        setVariants(newVariants);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[index].price = Number(e.target.value);
                        setVariants(newVariants);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[index].stock = Number(e.target.value);
                        setVariants(newVariants);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                    />

                    <input
                      type="text"
                      placeholder="SKU Code"
                      value={variant.sku}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[index].sku = e.target.value;
                        setVariants(newVariants);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section (Only for Food) */}
            {type === "food" && (
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Food Add-ons
                    </h2>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      🍕 Customizable
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {addons.length} add-on{addons.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addAddon}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Add-on
                  </button>
                </div>

                <div className="space-y-4">
                  {addons.map((addon, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/80 rounded-2xl border border-gray-200 shadow-sm"
                    >
                      <input
                        type="text"
                        placeholder="Add-on name (e.g., Extra Cheese)"
                        value={addon.name}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].name = e.target.value;
                          setAddons(newAddons);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                      />

                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={addon.description}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].description = e.target.value;
                          setAddons(newAddons);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                      />

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          value={addon.price}
                          onChange={(e) => {
                            const newAddons = [...addons];
                            newAddons[index].price = Number(e.target.value);
                            setAddons(newAddons);
                          }}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white text-sm placeholder-gray-400 transition-all duration-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Product to Catalog
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
