import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Package, Plus, Minus, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatEGP } from '../utils/helpers';
import ProductIcon from '../components/ProductIcon';
import toast from 'react-hot-toast';

export default function Inventory() {
  const { products, branches, updateProduct } = useData();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null); // product id for mobile expand

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.model.includes(searchQuery) ||
        p.brand.includes(searchQuery);
      return matchesSearch;
    });
  }, [searchQuery, products]);

  const getBranchStock = (product) => {
    if (selectedBranch === 'all') {
      return Object.values(product.stock).reduce((a, b) => a + b, 0);
    }
    return product.stock[selectedBranch] || 0;
  };

  const totalValue = filteredProducts.reduce((sum, p) => {
    const stock = getBranchStock(p);
    return sum + stock * p.cost;
  }, 0);

  const totalItems = filteredProducts.reduce((sum, p) => sum + getBranchStock(p), 0);

  const handleStockUpdate = (product, branchId, delta) => {
    const currentStock = product.stock[branchId] || 0;
    const newStock = Math.max(0, currentStock + delta);
    updateProduct(product.id, {
      stock: { ...product.stock, [branchId]: newStock },
    });
  };

  const handleSetStock = (product, branchId, value) => {
    const newStock = Math.max(0, parseInt(value) || 0);
    updateProduct(product.id, {
      stock: { ...product.stock, [branchId]: newStock },
    });
    toast.success(`تم تحديث مخزون ${product.model}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة المخزون</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          تتبع وتحديث المخزون في جميع الفروع
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">إجمالي القطع</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {totalItems.toLocaleString('ar-EG')}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">قيمة المخزون</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {formatEGP(totalValue)}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">عدد الفروع</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {branches.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-10 py-2 text-sm"
          />
        </div>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="select-field text-sm py-2 sm:w-64"
        >
          <option value="all">كل الفروع</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">المنتج</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الماركة</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">المقاس</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">التكلفة</th>
                {selectedBranch === 'all'
                  ? <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">إجمالي المخزون</th>
                  : <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">المخزون</th>
                }
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-slate-400">قيمة المخزون</th>
                {selectedBranch !== 'all' && (
                  <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">تحديث</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = selectedBranch === 'all'
                  ? Object.values(product.stock).reduce((a, b) => a + b, 0)
                  : product.stock[selectedBranch] || 0;

                return (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <ProductIcon iconType={product.iconType} category={product.category} />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {product.model}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {product.warranty} ضمان
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-900 dark:text-slate-200">{product.brand}</td>
                    <td className="p-4 text-sm text-slate-900 dark:text-slate-200">{product.dimensions}</td>
                    <td className="p-4 text-sm text-slate-900 dark:text-slate-200">{formatEGP(product.cost)}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {selectedBranch === 'all' ? (
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                            stock > 20
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : stock > 5
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                              : stock > 0
                              ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                          }`}>
                            {stock > 0 ? stock : 'نفذ'}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockUpdate(product, selectedBranch, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={stock}
                              onChange={(e) => handleSetStock(product, selectedBranch, e.target.value)}
                              className="w-16 text-center text-sm font-semibold bg-transparent border-b-2 border-gray-300 dark:border-slate-600 focus:border-primary-500 outline-none py-0.5"
                            />
                            <button
                              onClick={() => handleStockUpdate(product, selectedBranch, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {formatEGP(stock * product.cost)}
                    </td>
                    {selectedBranch !== 'all' && (
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleStockUpdate(product, selectedBranch, 10)}
                          className="text-xs px-2 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                        >
                          +10
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredProducts.map((product) => {
          const isExpanded = expandedProduct === product.id;
          const stock = selectedBranch === 'all'
            ? Object.values(product.stock).reduce((a, b) => a + b, 0)
            : product.stock[selectedBranch] || 0;

          return (
            <div key={product.id} className="mobile-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ProductIcon iconType={product.iconType} category={product.category} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{product.model}</p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedBranch === 'all' ? (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      stock > 20
                        ? 'bg-emerald-100 text-emerald-700'
                        : stock > 5
                        ? 'bg-amber-100 text-amber-700'
                        : stock > 0
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {stock > 0 ? `${stock} قطع` : 'نفذ'}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStockUpdate(product, selectedBranch, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-rose-100 text-rose-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => handleSetStock(product, selectedBranch, e.target.value)}
                        className="w-14 text-center text-sm font-semibold bg-transparent border-b-2 border-gray-300 dark:border-slate-600 focus:border-primary-500 outline-none"
                      />
                      <button
                        onClick={() => handleStockUpdate(product, selectedBranch, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-emerald-100 text-emerald-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedBranch === 'all' && (
                    <button
                      onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Basic info shown always */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                <div>
                  <p className="mobile-card-label">المقاس</p>
                  <p className="mobile-card-value">{product.dimensions}</p>
                </div>
                <div>
                  <p className="mobile-card-label">التكلفة</p>
                  <p className="mobile-card-value">{formatEGP(product.cost)}</p>
                </div>
                <div>
                  <p className="mobile-card-label">الضمان</p>
                  <p className="mobile-card-value">{product.warranty}</p>
                </div>
                <div>
                  <p className="mobile-card-label">قيمة المخزون</p>
                  <p className="mobile-card-value">{formatEGP(stock * product.cost)}</p>
                </div>
              </div>

              {/* Expanded: per-branch stock editing when "all branches" selected */}
              {isExpanded && selectedBranch === 'all' && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400">تحديث المخزون لكل فرع:</p>
                  {branches.map((branch) => {
                    const branchStock = product.stock[branch.id] || 0;
                    return (
                      <div key={branch.id} className="flex items-center justify-between py-1">
                        <span className="text-xs text-gray-600 dark:text-slate-300 truncate ml-2">
                          {branch.name}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStockUpdate(product, branch.id, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={branchStock}
                            onChange={(e) => handleSetStock(product, branch.id, e.target.value)}
                            className="w-12 text-center text-xs font-semibold bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-primary-500 outline-none"
                          />
                          <button
                            onClick={() => handleStockUpdate(product, branch.id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
