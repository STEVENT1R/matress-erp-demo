import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';


import {
  Trash2, Plus, Minus, Tag, Banknote,
  CreditCard, Printer, Check, ShoppingCart,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { useData } from '../../context/DataContext';
import { formatEGP, generateInvoice } from '../../utils/helpers';
import Receipt from './Receipt';
import ProductIcon from '../ProductIcon';
import toast from 'react-hot-toast';

export default function CartSidebar() {
  const { addSale } = useData();
  const {
    activeBranch, branches, setBranch,
    cartItems, addToCart, removeFromCart,
    updateQuantity, clearCart,
    discount, discountValue,
    discountType, setDiscount, setDiscountType,
    paymentTerm, setPaymentTerm,
    depositAmount, setDeposit,
    customerName, customerPhone, setCustomer,
    sellerId, sellerName, setSeller,
    subtotal, vat, total, remaining,
    users,
  } = usePOS();

  // Payment/Receipt state
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [saleComplete, setSaleComplete] = useState(null);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('السلة فارغة');
      return;
    }
    setShowPayment(true);
  };

  const handleConfirmPayment = () => {
    // Snapshot everything BEFORE changing any state
    const cartSnapshot = cartItems.map((i) => ({ ...i }));
    const saleSubtotal = subtotal;
    const saleVat = vat;
    const saleDiscount = discountValue;
    const saleTotal = total;
    const saleRemaining = paymentTerm === 'deposit' ? remaining : 0;

    const invoice = generateInvoice();
    const sale = {
      invoice,
      customer: customerName || 'عميل نقدي',
      phone: customerPhone || '',
      sellerName: sellerName || 'غير محدد',
      items: cartSnapshot.length,
      cartSnapshot,
      subtotal: saleSubtotal,
      vat: saleVat,
      discount: saleDiscount,
      total: saleTotal,
      remaining: saleRemaining,
      paymentMethod: paymentTerm === 'deposit' ? 'عربون' : 'نقداً',
      date: new Date().toISOString(),
      branch: activeBranch?.id || 'b1',
      status: 'مكتمل',
    };

    // Save to data context
    addSale(sale);

    // Close payment modal, show receipt
    setSaleComplete({ ...sale, cartSnapshot: [...cartSnapshot] });
    setShowPayment(false);
    setShowReceipt(true);
    toast.success(`تم إتمام البيع - ${invoice}`);
  };

  const handleNewSale = () => {
    clearCart();
    setShowReceipt(false);
    setSaleComplete(null);
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white dark:bg-slate-800/50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              سلة المشتريات
            </h2>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
                <Trash2 className="w-3 h-3" />
                تفريغ
              </button>
            )}
          </div>
          <select
            value={activeBranch?.id || ''}
            onChange={(e) => {
              const b = branches.find((br) => br.id === e.target.value);
              if (b) setBranch(b);
            }}
            className="select-field text-xs py-1.5"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-slate-400">السلة فارغة</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">اختر منتجات من القائمة</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 group"
              >
                <ProductIcon iconType={item.iconType} category={item.category} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary-600 dark:text-primary-400">{item.brand}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.model}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{item.dimensions}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold min-w-[24px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatEGP(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Seller Selection */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">الكاشير</span>
          </div>
          <select
            value={sellerId || ''}
            onChange={(e) => {
              const u = users.find((u) => u.id === e.target.value);
              if (u) setSeller(u.id, u.name);
            }}
            className="select-field text-xs py-1.5 w-full"
          >
            <option value="">اختر الكاشير</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>

        {/* Customer Info */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-slate-700">
          <div className="flex gap-2">
            <input type="text" placeholder="اسم العميل" value={customerName}
              onChange={(e) => setCustomer(e.target.value, customerPhone)}
              className="input-field text-xs py-1.5 flex-1" />
            <input type="text" placeholder="رقم الهاتف" value={customerPhone}
              onChange={(e) => setCustomer(customerName, e.target.value)}
              className="input-field text-xs py-1.5 w-28" />
          </div>
        </div>

        {/* Discount */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">خصم</span>
            <button onClick={() => setDiscountType(discountType === 'amount' ? 'percent' : 'amount')}
              className="text-xs text-primary-600 hover:text-primary-700">
              {discountType === 'amount' ? 'جنيه' : '%'}
            </button>
          </div>
          <div className="flex gap-2">
            <input type="number" value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
              placeholder="0" className="input-field text-xs py-1.5 flex-1" />
            <span className="text-xs text-gray-400 self-center">{discountType === 'amount' ? 'ج.م' : '%'}</span>
          </div>
        </div>

        {/* Payment Term */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-slate-700">
          <span className="text-xs font-medium text-gray-500 dark:text-slate-400 block mb-1">طريقة الدفع</span>
          <div className="flex gap-2">
            <button onClick={() => { setPaymentTerm('full'); setDeposit(0); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                paymentTerm === 'full'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border-2 border-transparent'
              }`}>
              <Banknote className="w-4 h-4 mx-auto mb-1" />
              كامل
            </button>
            <button onClick={() => setPaymentTerm('deposit')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                paymentTerm === 'deposit'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-2 border-amber-500'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border-2 border-transparent'
              }`}>
              <CreditCard className="w-4 h-4 mx-auto mb-1" />
              عربون
            </button>
          </div>
          {paymentTerm === 'deposit' && (
            <div className="mt-2">
              <label className="text-xs text-gray-500 dark:text-slate-400">المبلغ المدفوع (عربون)</label>
              <input type="number" value={depositAmount} onChange={(e) => setDeposit(Math.max(0, Number(e.target.value)))}
                placeholder="المبلغ..." className="input-field text-xs py-1.5 mt-1" />
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
            <span>المجموع الفرعي</span>
            <span>{formatEGP(subtotal)}</span>
          </div>
          {discountValue > 0 && (
            <div className="flex justify-between text-xs text-rose-500">
              <span>الخصم</span>
              <span>-{formatEGP(discountValue)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
            <span>ضريبة القيمة المضافة (14%)</span>
            <span>{formatEGP(vat)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-gray-200 dark:border-slate-700">
            <span>الإجمالي</span>
            <span className="text-emerald-600 dark:text-emerald-400">{formatEGP(total)}</span>
          </div>
          {paymentTerm === 'deposit' && remaining > 0 && (
            <div className="flex justify-between text-sm font-semibold text-amber-600 dark:text-amber-400">
              <span>المتبقي</span>
              <span>{formatEGP(remaining)}</span>
            </div>
          )}
        </div>

        {/* Checkout Button */}
        <div className="p-3 pt-0">
          <button onClick={handleCheckout} disabled={cartItems.length === 0}
            className="btn-primary w-full py-3">
            <Check className="w-5 h-5" />
            إتمام البيع
          </button>
        </div>
      </div>

      {/* ---- PAYMENT MODAL ---- */}
      <AnimatePresence>
        {showPayment && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPayment(false)}
              className="fixed inset-0 bg-black/50 z-[9990]" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[9991] flex items-center justify-center p-4 pointer-events-none">
              <div onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">تأكيد البيع</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    {cartItems.length} منتج - الإجمالي {formatEGP(total)}
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">طريقة الدفع</span>
                    <span className="font-semibold">{paymentTerm === 'full' ? 'كامل' : 'عربون'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">العميل</span>
                    <span className="font-semibold">{customerName || 'عميل نقدي'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-emerald-600">{formatEGP(total)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowPayment(false)} className="btn-secondary flex-1">إلغاء</button>
                  <button onClick={handleConfirmPayment} className="btn-success flex-1">تأكيد</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---- RECEIPT MODAL (Full Screen) - rendered via portal to body to avoid ancestor overflow clipping ---- */}
      {showReceipt && saleComplete && createPortal(
        <div className="receipt-overlay fixed inset-0 z-[9992] flex flex-col bg-white dark:bg-slate-900">
          {/* Receipt scrollable content */}
          <div className="receipt-print-area flex-1 overflow-y-auto p-4">
            <Receipt
              sale={saleComplete}
              cartItems={saleComplete.cartSnapshot || []}
              total={saleComplete.total}
              vat={saleComplete.vat}
              discountValue={saleComplete.discount}
            />
          </div>
          {/* Action buttons pinned at bottom */}
          <div className="receipt-buttons flex gap-3 p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 print:hidden">
            <button
              onClick={() => {
                // Open receipt in a new window for reliable printing
                const printWindow = window.open('', '_blank', 'width=400,height=600');
                if (!printWindow) { toast.error('الرجاء السماح للنوافذ المنبثقة لطباعة الإيصال'); return; }
                printWindow.document.write(`
                  <!DOCTYPE html>
                  <html dir="rtl">
                  <head>
                    <meta charset="UTF-8" />
                    <title>إيصال - ${saleComplete?.invoice || 'مراتب'}</title>
                    <style>
                      @page { size: 80mm auto; margin: 0; }
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body {
                        font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
                        background: white;
                        color: black;
                        font-size: 12px;
                        line-height: 1.5;
                        padding: 8px;
                        width: 80mm;
                      }
                      .receipt-header { text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 8px; margin-bottom: 8px; }
                      .receipt-header h2 { font-size: 18px; font-weight: bold; margin-bottom: 2px; }
                      .receipt-header p { color: #666; font-size: 11px; }
                      .receipt-info { border-bottom: 1px dashed #ccc; padding-bottom: 6px; margin-bottom: 6px; }
                      .receipt-info .row { display: flex; justify-content: space-between; font-size: 11px; }
                      .receipt-info .row span:first-child { color: #666; }
                      .receipt-info .row span:last-child { font-weight: 600; }
                      table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
                      th { text-align: right; border-bottom: 1px dashed #ccc; padding: 4px 0; font-size: 11px; color: #666; }
                      th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: left; }
                      td { padding: 4px 0; border-bottom: 1px dotted #eee; font-size: 11px; }
                      td:nth-child(2), td:nth-child(3), td:nth-child(4) { text-align: left; }
                      td:nth-child(1) { font-weight: 600; }
                      .product-detail { font-size: 10px; color: #888; }
                      .totals { border-top: 1px dashed #ccc; padding-top: 6px; }
                      .totals .row { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; }
                      .totals .total-row { font-size: 14px; font-weight: bold; padding-top: 4px; border-top: 1px dashed #ccc; margin-top: 4px; }
                      .receipt-footer { text-align: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed #ccc; color: #888; font-size: 10px; }
                      .no-print { display: none; }
                    </style>
                  </head>
                  <body>
                    <div class="receipt-header">
                      <h2>مراتب</h2>
                      <p>نظام إدارة متاجر المراتب</p>
                      <p>الفرع الرئيسي - القاهرة</p>
                      <p>شارع التسعين، التجمع الخامس</p>
                      <p>ت: 0223456789</p>
                    </div>
                    <div class="receipt-info">
                      <div class="row"><span>الفاتورة:</span><span>${saleComplete?.invoice || '---'}</span></div>
                      <div class="row"><span>التاريخ:</span><span>${new Date().toLocaleDateString('ar-EG')}</span></div>
                      <div class="row"><span>العميل:</span><span>${saleComplete?.customer || '---'}</span></div>
                      <div class="row"><span>الكاشير:</span><span>${saleComplete?.sellerName || 'أحمد السيد'}</span></div>
                    </div>
                    <table>
                      <thead><tr><th>المنتج</th><th>العدد</th><th>السعر</th><th>الإجمالي</th></tr></thead>
                      <tbody>
                        ${(saleComplete?.cartSnapshot || []).map(item => `
                          <tr>
                            <td>${item.displayName || item.model}<div class="product-detail">${item.brand} · ${item.dimensions}</div></td>
                            <td>${item.quantity}</td>
                            <td>${(item.price || 0).toLocaleString()} ج.م</td>
                            <td>${((item.price || 0) * item.quantity).toLocaleString()} ج.م</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                    <div class="totals">
                      <div class="row"><span>المجموع الفرعي</span><span>${(saleComplete?.subtotal || 0).toLocaleString()} ج.م</span></div>
                      ${(saleComplete?.discount || 0) > 0 ? `<div class="row" style="color:#e74c3c"><span>الخصم</span><span>-${(saleComplete?.discount || 0).toLocaleString()} ج.م</span></div>` : ''}
                      <div class="row"><span>ضريبة القيمة المضافة 14%</span><span>${(saleComplete?.vat || 0).toLocaleString()} ج.م</span></div>
                      <div class="row total-row"><span>الإجمالي</span><span>${(saleComplete?.total || 0).toLocaleString()} ج.م</span></div>
                    </div>
                    <div class="receipt-footer">
                      <p>شكراً لتسوقكم معنا</p>
                      <p>نتمنى لكم نوماً هانئاً</p>
                      <p>مراتب - نوم هادئ، حياة أفضل</p>
                    </div>
                    <button class="no-print" onclick="window.print()" style="display:none">طباعة</button>
                  </body>
                  </html>
                `);
                printWindow.document.close();
                // Wait for content to render then print
                setTimeout(() => {
                  printWindow.focus();
                  printWindow.print();
                }, 300);
              }}
              className="btn-secondary flex-1 py-3 text-base font-semibold"
            >
              <Printer className="w-5 h-5" />
              طباعة
            </button>

            <button
              onClick={handleNewSale}
              className="btn-primary flex-1 py-3 text-base font-semibold"
            >
              <Check className="w-5 h-5" />
              موافقة
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}