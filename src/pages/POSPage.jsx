import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/pos/ProductGrid';
import CartSidebar from '../components/pos/CartSidebar';

export default function POSPage() {
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Header for mobile */}
      <div className="lg:hidden flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">نقطة البيع</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          className="btn-primary relative"
        >
          <ShoppingCart className="w-4 h-4" />
          السلة
        </button>
      </div>

      {/* Products Area */}
      <motion.div
        layout
        className={`flex-1 glass-card overflow-hidden ${
          showCart ? 'hidden lg:flex' : 'flex'
        } flex-col`}
      >
        <ProductGrid />
      </motion.div>

      {/* Cart Sidebar */}
      <motion.div
        layout
        className={`w-full lg:w-96 ${
          showCart ? 'flex' : 'hidden lg:flex'
        } flex-col glass-card overflow-hidden`}
      >
        <CartSidebar />
      </motion.div>
    </div>
  );
}
