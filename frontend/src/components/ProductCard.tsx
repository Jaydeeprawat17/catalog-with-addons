//ProductCard.tsx
import { type Product } from "../types/catalog";
import { ShoppingBag, Utensils, Zap, Shirt, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Food":
        return <Utensils className="w-4 h-4" />;
      case "Electronics":
        return <Zap className="w-4 h-4" />;
      case "Apparel":
        return <Shirt className="w-4 h-4" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Food":
        return "bg-orange-500";
      case "Electronics":
        return "bg-blue-500";
      case "Apparel":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Handle empty variants array gracefully
  const hasVariants = product.variants && product.variants.length > 0;
  const minPrice = hasVariants
    ? Math.min(...product.variants.map((v) => v.price))
    : product.basePrice || 0;
  const maxPrice = hasVariants
    ? Math.max(...product.variants.map((v) => v.price))
    : product.basePrice || 0;

  const priceDisplay =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

  const totalStock = hasVariants
    ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
    : 10; // Default stock for display

  // Check if product has add-ons (for food items only)
  const hasAddOns =
    product.type === "Food" && product.addOns && product.addOns.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-gray-100">
      <div
        className="relative overflow-hidden"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0]
              : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
          }
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
        />

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <div
            className={`${getTypeColor(
              product.type
            )} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
          >
            {getTypeIcon(product.type)}
            {product.type}
          </div>
        </div>

        {/* Customizable Badge for Food with Add-ons */}
        {hasAddOns && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Utensils className="w-3 h-3" />
              Customizable
            </div>
          </div>
        )}

        {/* Stock Badge - Only show if in stock */}
        {totalStock > 0 && (
          <div className="absolute bottom-4 left-4">
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                totalStock > 20
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {totalStock} in stock
            </div>
          </div>
        )}

        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-xl">
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Variants Preview */}
        {hasVariants && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">
                Available in:
              </span>
              <span className="text-sm text-gray-500">
                {product.variants.length} variant
                {product.variants.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant, index) => (
                <div
                  key={variant.id}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {variant.size && variant.color
                    ? `${variant.size} - ${variant.color}`
                    : variant.size || variant.color || "Standard"}
                </div>
              ))}
              {product.variants.length > 3 && (
                <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{product.variants.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add-ons Preview for Food */}
        {hasAddOns && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                Customizable with add-ons
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.addOns!.slice(0, 2).map((addon) => (
                <div
                  key={addon.id}
                  className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs border border-orange-200"
                >
                  {addon.name} (+${addon.price.toFixed(2)})
                </div>
              ))}
              {product.addOns!.length > 2 && (
                <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs border border-orange-200">
                  +{product.addOns!.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {priceDisplay}
            </span>
            <span className="text-sm text-gray-500">
              {hasVariants ? "Starting from" : "Price"}
            </span>
          </div>
          <button
            onClick={() => onViewDetails(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
