//Index.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type ProductType, type Product } from "../types/catalog";
import { ShoppingBag, Search, RefreshCw, Plus } from "lucide-react";
import { TypeFilter } from "../components/TypeFilter";
import { ProductModal } from "../components/ProductModal";
import { ProductCard } from "../components/ProductCard";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const route = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIXED fetchProducts function for Index.tsx - Show ALL products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4040/show-products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Raw API Response:", JSON.stringify(data, null, 2));

      const mapped: Product[] = data.map((p: any) => {
        // Ensure variants is always an array
        const variants = Array.isArray(p.variants) ? p.variants : [];
        // CRITICAL: Backend returns 'addons', frontend expects 'addOns'
        const addons = Array.isArray(p.addons) ? p.addons : [];

        console.log(
          `Product: ${p.name}, Type: ${p.type_name}, Variants: ${variants.length}, Addons: ${addons.length}`
        );

        const mappedProduct = {
          id: String(p.id),
          name: p.name || "Unknown Product",
          description: p.description || "No description available",
          // CRITICAL: Ensure correct type from database
          type: p.type_name || "Electronics",
          images: p.image
            ? [`http://localhost:4040/uploads/${p.image}`]
            : [
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
              ],
          variants: variants
            .filter((v: any) => v.id) // Include all variants
            .map((v: any) => ({
              id: String(v.id),
              size: v.size || undefined,
              color: v.color || undefined,
              price: Number(v.price) || 0,
              stock: Number(v.stock) || 50, // Show good stock for catalog display
              sku: v.sku || `sku-${v.id}`,
            })),
          // CRITICAL: Only Food items get addOns
          addOns:
            p.type_name === "Food" && addons.length > 0
              ? addons
                  .filter((a: any) => a.name && a.name.trim())
                  .map((a: any) => ({
                    id: String(a.id),
                    name: a.name.trim(),
                    price: Number(a.price) || 0,
                    description: a.description || "",
                  }))
              : [],
          basePrice: Number(p.base_price) || 0,
        };

        console.log(
          `✅ Mapped Product: ${mappedProduct.name}, Type: ${
            mappedProduct.type
          }, Variants: ${mappedProduct.variants.length}, AddOns: ${
            mappedProduct.addOns?.length || 0
          }`
        );

        return mappedProduct;
      }); // REMOVED FILTERING - Show all products

      console.log(`📊 Total products loaded: ${mapped.length}`);
      console.log(
        "Product types:",
        mapped.map((p) => p.type)
      );
      setProducts(mapped);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesType = selectedType === "All" || p.type === selectedType;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [products, selectedType, searchQuery]);

  const productCounts = useMemo(() => {
    const counts: Record<ProductType | "All", number> = {
      All: products.length,
      Food: products.filter((p) => p.type === "Food").length,
      Electronics: products.filter((p) => p.type === "Electronics").length,
      Apparel: products.filter((p) => p.type === "Apparel").length,
    };
    return counts;
  }, [products]);

  const handleAddProduct = () => {
    route("/add-product");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductClick = (product: Product) => {
    console.log("Selected product:", product); // Debug log
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  Product Catalog
                </h1>
                <p className="text-sm text-gray-500">Manage your inventory</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`-ml-0.5 mr-2 h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Type Filters */}
        <TypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          productCounts={productCounts}
        />

        {/* Results Summary */}
        <div className="mb-12">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <p className="text-gray-700 text-xl">
              <span className="font-bold text-gray-900 text-2xl">
                {filteredProducts.length}
              </span>{" "}
              product{filteredProducts.length !== 1 ? "s" : ""} found
              {selectedType !== "All" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-bold text-blue-600">
                    {selectedType}
                  </span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  matching{" "}
                  <span className="font-bold text-purple-600">
                    "{searchQuery}"
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleProductClick}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-20">
            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
              <Search className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No products found
            </h3>
            <p className="text-gray-600 text-xl max-w-md mx-auto mb-8">
              Try adjusting your search terms or browse different categories to
              find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("All");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : null}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
