import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Plus, Star } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { formatEGP, getBrands, getSizes, getHeights } from '../../utils/helpers';
import ProductIcon from '../ProductIcon';

export default function ProductGrid() {
  const {
    products,
    searchQuery,
    searchFilters,
    setSearch,
    setSearchFilter,
    addToCart,
  } = usePOS();

  const [showFilters, setShowFilters] = useState(false);
  const brands = getBrands(products);
  const sizes = getSizes(products);
  const heights = getHeights(products);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.model.includes(searchQuery) ||
      p.brand.includes(searchQuery) ||
      p.description.includes(searchQuery);
    const matchesBrand = !searchFilters.brand || p.brand === searchFilters.brand;
    const matchesSize = !searchFilters.size || p.dimensions === searchFilters.size;
    const matchesHeight = !searchFilters.height || p.height === searchFilters.height;
    return matchesSearch && matchesBrand && matchesSize && matchesHeight;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filters */}
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pr-10 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${
              showFilters
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 dark:text-slate-400">
            {filteredProducts.length} منتج
          </span>
          {(searchQuery || searchFilters.brand || searchFilters.size) && (
            <button
              onClick={() => {
                setSearch('');
                setSearchFilter('brand', '');
                setSearchFilter('size', '');
                setSearchFilter('height', '');
              }}
              className="text-xs text-primary-600 hover:text-primary-700 mr-auto"
            >
              إعادة تعيين
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
          >
            <select
              value={searchFilters.brand}
              onChange={(e) => setSearchFilter('brand', e.target.value)}
              className="select-field text-xs py-1.5"
            >
              <option value="">كل الماركات</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={searchFilters.size}
              onChange={(e) => setSearchFilter('size', e.target.value)}
              className="select-field text-xs py-1.5"
            >
              <option value="">كل المقاسات</option>
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={searchFilters.height}
              onChange={(e) => setSearchFilter('height', e.target.value)}
              className="select-field text-xs py-1.5"
            >
              <option value="">كل الارتفاعات</option>
              {heights.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-3 pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((product, i) => {
            const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
            return (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => addToCart(product)}
                className="text-right glass-card p-3 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <div className="mb-2">
                  <ProductIcon iconType={product.iconType} category={product.category} size="lg" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                    {product.brand}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    {product.model}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {product.dimensions} · {product.height}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatEGP(product.price)}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      totalStock > 10
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : totalStock > 0
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                    }`}>
                      {totalStock > 0 ? `${totalStock} قطع` : 'نفذ'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-500 dark:text-slate-400">{product.rating}</span>
                  </div>
                </div>
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-slate-400">لا توجد منتجات مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
}
