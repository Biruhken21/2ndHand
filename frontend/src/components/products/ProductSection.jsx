import React from "react";
import { Package, DollarSign, Eye, PlusCircle } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductSection = ({
  loadingProducts,
  filteredProducts,
  products,
  categories,
  setShowPostForm,
  searchTerm,
  selectedCategory
}) => {
  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div className="text-center py-20">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold">No products found</h3>
        <p className="text-gray-500 mt-2">
          {searchTerm
            ? `No results for "${searchTerm}"`
            : "No products available"}
        </p>
        <button
          onClick={() => setShowPostForm(true)}
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          Post Product
        </button>
      </div>
    );
  }

  return (
    <div className="px-6">
      <h2 className="text-2xl font-bold mb-6">
        Products ({filteredProducts.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
