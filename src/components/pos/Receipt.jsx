import { formatEGP } from '../../utils/helpers';

export default function Receipt({ sale, cartItems, total, vat, discountValue }) {
  const subtotal = cartItems?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-4 text-gray-900 dark:text-gray-100 text-xs leading-relaxed" dir="rtl">
      <div className="text-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-3 mb-3">
        <h2 className="text-lg font-bold">مراتب</h2>
        <p>نظام إدارة متاجر المراتب</p>
        <p className="text-gray-500 dark:text-gray-400">الفرع الرئيسي - القاهرة</p>
        <p className="text-gray-500 dark:text-gray-400">شارع التسعين، التجمع الخامس</p>
        <p className="text-gray-500 dark:text-gray-400">ت: 0223456789</p>
      </div>

      <div className="border-b border-dashed border-gray-300 dark:border-gray-600 pb-2 mb-2">
        <div className="flex justify-between">
          <span>الفاتورة:</span>
          <span className="font-bold">{sale?.invoice || '---'}</span>
        </div>
        <div className="flex justify-between">
          <span>التاريخ:</span>
          <span>{new Date().toLocaleDateString('ar-EG')}</span>
        </div>
        <div className="flex justify-between">
          <span>العميل:</span>
          <span>{sale?.customer || '---'}</span>
        </div>
        <div className="flex justify-between">
          <span>الكاشير:</span>
          <span>{sale?.sellerName || 'أحمد السيد'}</span>
        </div>
      </div>

      <table className="w-full mb-2">
        <thead>
          <tr className="border-b border-dashed border-gray-300 dark:border-gray-600">
            <th className="text-right py-1">المنتج</th>
            <th className="text-center py-1">العدد</th>
            <th className="text-left py-1">السعر</th>
            <th className="text-left py-1">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
            <tr key={item.id} className="border-b border-dotted border-gray-200 dark:border-gray-700">
              <td className="py-1">
                <p className="font-semibold">{item.displayName || item.model}</p>
                <p className="text-gray-500 dark:text-gray-400">{item.brand} · {item.dimensions}</p>
              </td>
              <td className="text-center py-1">{item.quantity}</td>
              <td className="text-left py-1">{formatEGP(item.price)}</td>
              <td className="text-left py-1">{formatEGP(item.price * item.quantity)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">لا توجد منتجات</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 space-y-1">
        <div className="flex justify-between">
          <span>المجموع الفرعي</span>
          <span>{formatEGP(subtotal)}</span>
        </div>
        {discountValue > 0 && (
          <div className="flex justify-between text-red-600 dark:text-red-400">
            <span>الخصم</span>
            <span>-{formatEGP(discountValue)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>ضريبة القيمة المضافة 14%</span>
          <span>{formatEGP(vat || 0)}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-1 border-t border-dashed border-gray-300 dark:border-gray-600">
          <span>الإجمالي</span>
          <span>{formatEGP(total || 0)}</span>
        </div>
      </div>

      <div className="text-center mt-4 pt-3 border-t border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
        <p>شكراً لتسوقكم معنا</p>
        <p>نتمنى لكم نوماً هانئاً</p>
        <p className="mt-1">مراتب - نوم هادئ، حياة أفضل</p>
      </div>
    </div>
  );
}
