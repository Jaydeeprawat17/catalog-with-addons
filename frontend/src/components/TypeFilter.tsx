import { type ProductType } from "../types/catalog";
import { Utensils, Zap, Shirt, Grid3x3 } from "lucide-react";

interface TypeFilterProps {
  selectedType: ProductType | "All";
  onTypeChange: (type: ProductType | "All") => void;
  productCounts: Record<ProductType | "All", number>;
}

export function TypeFilter({
  selectedType,
  onTypeChange,
  productCounts,
}: TypeFilterProps) {
  const filters = [
    {
      type: "All" as const,
      label: "All Products",
      icon: Grid3x3,
      color: "from-gray-600 to-gray-700",
    },
    {
      type: "Food" as const,
      label: "Food",
      icon: Utensils,
      color: "from-orange-500 to-red-500",
    },
    {
      type: "Electronics" as const,
      label: "Electronics",
      icon: Zap,
      color: "from-blue-500 to-indigo-600",
    },
    {
      type: "Apparel" as const,
      label: "Apparel",
      icon: Shirt,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Shop by Category</h2>
      <div className="flex flex-wrap gap-4">
        {filters.map(({ type, label, icon: Icon, color }) => {
          const isSelected = selectedType === type;
          const count = productCounts[type] || 0;

          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
                isSelected
                  ? `bg-gradient-to-r ${color} text-white shadow-lg transform scale-105`
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              <div
                className={`px-2 py-1 rounded-full text-sm font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
