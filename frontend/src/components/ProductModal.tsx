//ProductModal.tsx
import { useState, useEffect } from "react";

import {
  type Product,
  type ProductVariant,
  type AddOn,
} from "../types/catalog";
import {
  ShoppingCart,
  Package,
  Star,
  Utensils,
  X,
  Check,
  Zap,
  Shirt,
} from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Reset state when product changes
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedAddOns([]);
    } else if (product) {
      // If no variants, create a default one for display
      setSelectedVariant({
        id: "default",
        price: product.basePrice || 0,
        stock: 10, // Default stock for catalog display
        sku: "default-sku",
      });
      setSelectedAddOns([]);
    }
  }, [product]);

  if (!product) return null;

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotalPrice = () => {
    let total = selectedVariant?.price || product.basePrice || 0;

    if (
      product.type === "Food" &&
      product.addOns &&
      product.addOns.length > 0
    ) {
      selectedAddOns.forEach((addOnId) => {
        const addOn = product.addOns?.find((ao) => ao.id === addOnId);
        if (addOn) total += addOn.price;
      });
    }

    return total;
  };

  const getVariantLabel = (variant: ProductVariant) => {
    const parts = [];
    if (variant.size) parts.push(variant.size);
    if (variant.color) parts.push(variant.color);
    return parts.join(" - ") || "Standard";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Food":
        return <Utensils className="w-4 h-4" />;
      case "Electronics":
        return <Zap className="w-4 h-4" />;
      case "Apparel":
        return <Shirt className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const hasVariants = product.variants && product.variants.length > 0;
  const hasAddOns =
    product.type === "Food" && product.addOns && product.addOns.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                product.type === "Food"
                  ? "bg-orange-100 text-orange-800"
                  : product.type === "Electronics"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {getTypeIcon(product.type)}
              {product.type}
            </div>
            {hasAddOns && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Customizable
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                }
                alt={product.name}
                className="w-full h-80 lg:h-96 object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>SKU: {selectedVariant?.sku || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                Available
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants Selection */}
            {hasVariants && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  Choose Variant
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        selectedVariant?.id === variant.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedVariant?.id === variant.id
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedVariant?.id === variant.id && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              {getVariantLabel(variant)}
                            </span>
                            <div className="text-sm text-gray-500">
                              SKU: {variant.sku}
                            </div>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          ${variant.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons for Food Items ONLY */}
            {hasAddOns && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-600" />
                  Customize Your {product.type}
                </h3>
                <div className="space-y-3">
                  {product.addOns!.map((addOn: AddOn) => (
                    <div
                      key={addOn.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleAddOnToggle(addOn.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedAddOns.includes(addOn.id)
                              ? "bg-orange-500 border-orange-500"
                              : "border-gray-300 hover:border-orange-400"
                          }`}
                        >
                          {selectedAddOns.includes(addOn.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>
                        <div>
                          <label className="font-medium text-gray-900 cursor-pointer">
                            {addOn.name}
                          </label>
                          {addOn.description && (
                            <p className="text-sm text-gray-500">
                              {addOn.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold text-orange-600">
                        +${addOn.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary for Food with Add-ons */}
            {selectedAddOns.length > 0 && (
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-600" />
                  Your Customizations:
                </h4>
                <div className="space-y-1">
                  {product.addOns
                    ?.filter((ao) => selectedAddOns.includes(ao.id))
                    .map((ao) => (
                      <div key={ao.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{ao.name}</span>
                        <span className="font-medium text-orange-600">
                          +${ao.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Price and Add to Cart */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">
                  Total Price:
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  ${calculateTotalPrice().toFixed(2)}
                </span>
              </div>

              <button className="w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <ShoppingCart className="w-5 h-5" />
                View in Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
