// ============================================================
// MATTRESS ERP - Complete Mock Data
// Egyptian Market Data with Realistic Brands & Products
// ============================================================

// ---- USERS ----
export const usersData = [
  { id: 'u1', name: 'أحمد السيد', role: 'مدير النظام', email: 'ahmed@matress.com', phone: '01001234567', avatar: 'AS' },
  { id: 'u2', name: 'محمد علي', role: 'مدير مبيعات', email: 'mohamed@matress.com', phone: '01002345678', avatar: 'MA' },
  { id: 'u3', name: 'سارة خالد', role: 'أمين مخزن', email: 'sara@matress.com', phone: '01003456789', avatar: 'SK' },
  { id: 'u4', name: 'خالد عمر', role: 'مندوب توصيل', email: 'khaled@matress.com', phone: '01004567890', avatar: 'KO' },
  { id: 'u5', name: 'نورهان أحمد', role: 'محاسب', email: 'nourhan@matress.com', phone: '01005678901', avatar: 'NA' },
  { id: 'u6', name: 'إبراهيم حسن', role: 'مندوب مبيعات', email: 'ibrahim@matress.com', phone: '01006789012', avatar: 'IH' },
  { id: 'u7', name: 'مريم جمال', role: 'مدير تسويق', email: 'maram@matress.com', phone: '01007890123', avatar: 'MJ' },
];

// ---- BRANCHES ----
export const branchesData = [
  { id: 'b1', name: 'الفرع الرئيسي - القاهرة', city: 'القاهرة', address: 'شارع التسعين، التجمع الخامس', phone: '0223456789', manager: 'أحمد السيد' },
  { id: 'b2', name: 'فرع الإسكندرية', city: 'الإسكندرية', address: 'شارع سيدي جابر، محطة الرمل', phone: '0323456789', manager: 'سارة خالد' },
  { id: 'b3', name: 'فرع الجيزة', city: 'الجيزة', address: 'شارع الهرم، المهندسين', phone: '0224567890', manager: 'محمد علي' },
  { id: 'b4', name: 'فرع المنصورة', city: 'المنصورة', address: 'شارع الجمهورية', phone: '0502345678', manager: 'نورهان أحمد' },
  { id: 'b5', name: 'المخزن الرئيسي', city: 'العاشر من رمضان', address: 'المنطقة الصناعية C2', phone: '0552345678', manager: 'خالد عمر' },
];

// ---- PRODUCTS (32 Egyptian Mattresses) ----
export const productsData = [
  // --- Janssen ---
  {
    id: 'p1', brand: 'Janssen', model: 'كومفورت 2000', category: 'سوست منفصلة',
    dimensions: '160x200', height: '25 سم', price: 8999, cost: 5500,
    warranty: '10 سنوات', stock: { b1: 12, b2: 8, b3: 5, b4: 0, b5: 30 },
    iconType: 'standard', description: 'مرتبة سوست منفصلة بطبقة علوية من الميموري فوم',
    rating: 4.8, tags: ['الأكثر مبيعاً', 'ممتازة'],
  },
  {
    id: 'p2', brand: 'Janssen', model: 'سوبر فيت', category: 'سوست منفصلة',
    dimensions: '180x200', height: '28 سم', price: 11999, cost: 7200,
    warranty: '12 سنوات', stock: { b1: 8, b2: 4, b3: 3, b4: 2, b5: 20 },
    iconType: 'premium', description: 'مرتبة سوست منفصلة فاخرة مع طبقة لاتكس طبيعي',
    rating: 4.9, tags: ['فاخرة', 'VIP'],
  },
  {
    id: 'p3', brand: 'Janssen', model: 'بوكس سبرينج', category: 'سوست منفصلة',
    dimensions: '150x200', height: '20 سم', price: 7499, cost: 4800,
    warranty: '8 سنوات', stock: { b1: 15, b2: 10, b3: 7, b4: 3, b5: 35 },
    iconType: 'standard', description: 'مرتبة بوكس سبرينج عملية ومتينة',
    rating: 4.6, tags: ['اقتصادية', 'جيدة'],
  },
  {
    id: 'p4', brand: 'Janssen', model: 'ميموري فوم', category: 'فوم',
    dimensions: '160x200', height: '22 سم', price: 7999, cost: 5000,
    warranty: '8 سنوات', stock: { b1: 10, b2: 6, b3: 4, b4: 5, b5: 25 },
    iconType: 'standard', description: 'مرتبة ميموري فوم تتكيف مع حرارة الجسم',
    rating: 4.7, tags: ['طبية', 'مريحة'],
  },
  {
    id: 'p5', brand: 'Janssen', model: 'سوبر كينج', category: 'سوست منفصلة',
    dimensions: '200x200', height: '30 سم', price: 15999, cost: 9500,
    warranty: '15 سنوات', stock: { b1: 5, b2: 2, b3: 1, b4: 0, b5: 10 },
    iconType: 'premium', description: 'مرتبة كينج سوبر فاخرة بمقاس كبير',
    rating: 5.0, tags: ['فاخرة', 'VIP', 'أكبر مقاس'],
  },
  {
    id: 'p6', brand: 'Janssen', model: 'فليكس', category: 'سوست منفصلة',
    dimensions: '120x190', height: '22 سم', price: 5499, cost: 3500,
    warranty: '5 سنوات', stock: { b1: 20, b2: 15, b3: 10, b4: 8, b5: 45 },
    iconType: 'standard', description: 'مرتبة مفردة عملية مثالية للغرف الصغيرة',
    rating: 4.5, tags: ['اقتصادية', 'مفردة'],
  },
  {
    id: 'p7', brand: 'Janssen', model: 'توب سليبر', category: 'فوم',
    dimensions: '90x190', height: '12 سم', price: 2999, cost: 1800,
    warranty: '3 سنوات', stock: { b1: 30, b2: 20, b3: 15, b4: 10, b5: 60 },
    iconType: 'standard', description: 'طبقة علوية من الفوم للراحة الإضافية',
    rating: 4.3, tags: ['إكسسوار', 'سعر ممتاز'],
  },

  // --- Taki ---
  {
    id: 'p8', brand: 'Taki', model: 'جراند', category: 'سوست منفصلة',
    dimensions: '160x200', height: '26 سم', price: 8499, cost: 5200,
    warranty: '10 سنوات', stock: { b1: 14, b2: 9, b3: 6, b4: 4, b5: 28 },
    iconType: 'standard', description: 'مرتبة جراند الفاخرة بنظام سوست متطور',
    rating: 4.7, tags: ['الأكثر مبيعاً'],
  },
  {
    id: 'p9', brand: 'Taki', model: 'لوكس', category: 'سوست منفصلة',
    dimensions: '180x200', height: '28 سم', price: 10999, cost: 6800,
    warranty: '12 سنوات', stock: { b1: 7, b2: 5, b3: 2, b4: 1, b5: 18 },
    iconType: 'premium', description: 'مرتبة لوكس الفاخرة مع قماش قطني طبيعي',
    rating: 4.8, tags: ['فاخرة'],
  },
  {
    id: 'p10', brand: 'Taki', model: 'سوفت دريم', category: 'فوم',
    dimensions: '160x200', height: '24 سم', price: 6999, cost: 4300,
    warranty: '8 سنوات', stock: { b1: 18, b2: 12, b3: 8, b4: 6, b5: 32 },
    iconType: 'standard', description: 'مرتبة فوم عالي الكثافة ناعمة ومريحة',
    rating: 4.6, tags: ['ناعمة', 'مريحة'],
  },
  {
    id: 'p11', brand: 'Taki', model: 'فاميلي', category: 'سوست منفصلة',
    dimensions: '150x200', height: '22 سم', price: 6499, cost: 4000,
    warranty: '8 سنوات', stock: { b1: 22, b2: 16, b3: 10, b4: 7, b5: 40 },
    iconType: 'standard', description: 'مرتبة عائلية اقتصادية متينة',
    rating: 4.5, tags: ['اقتصادية', 'عائلية'],
  },
  {
    id: 'p12', brand: 'Taki', model: 'برستيج', category: 'سوست منفصلة',
    dimensions: '200x200', height: '30 سم', price: 14999, cost: 9000,
    warranty: '15 سنوات', stock: { b1: 4, b2: 2, b3: 1, b4: 0, b5: 8 },
    iconType: 'premium', description: 'مرتبة برستيج كينج سوبر فاخرة جداً',
    rating: 4.9, tags: ['فاخرة', 'VIP'],
  },
  {
    id: 'p13', brand: 'Taki', model: 'جونيور', category: 'سوست منفصلة',
    dimensions: '90x190', height: '18 سم', price: 3999, cost: 2500,
    warranty: '5 سنوات', stock: { b1: 25, b2: 18, b3: 12, b4: 10, b5: 50 },
    iconType: 'standard', description: 'مرتبة مفردة مثالية للأطفال والمراهقين',
    rating: 4.4, tags: ['أطفال', 'مفردة'],
  },
  {
    id: 'p14', brand: 'Taki', model: 'ليدي', category: 'فوم',
    dimensions: '120x190', height: '20 سم', price: 4999, cost: 3100,
    warranty: '5 سنوات', stock: { b1: 16, b2: 10, b3: 7, b4: 5, b5: 30 },
    iconType: 'standard', description: 'مرتبة فوم ناعمة بتصميم أنيق',
    rating: 4.5, tags: ['أنيقة'],
  },

  // --- Forbed ---
  {
    id: 'p15', brand: 'Forbed', model: 'سيمفوني', category: 'سوست منفصلة',
    dimensions: '160x200', height: '27 سم', price: 9499, cost: 5800,
    warranty: '10 سنوات', stock: { b1: 10, b2: 7, b3: 4, b4: 2, b5: 22 },
    iconType: 'standard', description: 'مرتبة سيمفوني الفاخرة بطبقة لاتكس طبيعي',
    rating: 4.8, tags: ['فاخرة', 'لاتكس'],
  },
  {
    id: 'p16', brand: 'Forbed', model: 'هارموني', category: 'سوست منفصلة',
    dimensions: '180x200', height: '28 سم', price: 12499, cost: 7600,
    warranty: '12 سنوات', stock: { b1: 6, b2: 3, b3: 2, b4: 1, b5: 15 },
    iconType: 'premium', description: 'مرتبة هارموني الفاخرة جداً مع قماش حريري',
    rating: 4.9, tags: ['فاخرة', 'VIP'],
  },
  {
    id: 'p17', brand: 'Forbed', model: 'نوفا', category: 'فوم',
    dimensions: '160x200', height: '23 سم', price: 7499, cost: 4600,
    warranty: '8 سنوات', stock: { b1: 12, b2: 8, b3: 5, b4: 3, b5: 25 },
    iconType: 'standard', description: 'مرتبة فوم ذكي بتقنية التبريد',
    rating: 4.7, tags: ['مريحة', 'تبريد'],
  },
  {
    id: 'p18', brand: 'Forbed', model: 'إيليت', category: 'سوست منفصلة',
    dimensions: '150x200', height: '24 سم', price: 7999, cost: 4900,
    warranty: '8 سنوات', stock: { b1: 15, b2: 10, b3: 6, b4: 4, b5: 30 },
    iconType: 'standard', description: 'مرتبة إيليت بتقنية دعم الظهر الممتاز',
    rating: 4.6, tags: ['طبية', 'دعم الظهر'],
  },
  {
    id: 'p19', brand: 'Forbed', model: 'ديلوكس كينج', category: 'سوست منفصلة',
    dimensions: '200x200', height: '32 سم', price: 16999, cost: 10200,
    warranty: '15 سنوات', stock: { b1: 3, b2: 1, b3: 0, b4: 0, b5: 6 },
    iconType: 'premium', description: 'مرتبة ديلوكس كينج سوبر الأكثر فخامة',
    rating: 5.0, tags: ['فاخرة', 'VIP', 'أفخم'],
  },
  {
    id: 'p20', brand: 'Forbed', model: 'بامبي', category: 'فوم',
    dimensions: '90x190', height: '15 سم', price: 3499, cost: 2100,
    warranty: '5 سنوات', stock: { b1: 28, b2: 20, b3: 14, b4: 8, b5: 55 },
    iconType: 'baby', description: 'مرتبة أطفال فوم ناعمة وآمنة',
    rating: 4.4, tags: ['أطفال', 'آمنة'],
  },

  // --- Extra Brands: Serta & Dream Line ---
  {
    id: 'p21', brand: 'Serta', model: 'بيرفكت سليبر', category: 'سوست منفصلة',
    dimensions: '160x200', height: '26 سم', price: 9999, cost: 6100,
    warranty: '10 سنوات', stock: { b1: 9, b2: 5, b3: 3, b4: 1, b5: 20 },
    iconType: 'standard', description: 'مرتبة Serta الأمريكية الفاخرة',
    rating: 4.7, tags: ['فاخرة', 'أمريكية'],
  },
  {
    id: 'p22', brand: 'Serta', model: 'كومفورت كينج', category: 'سوست منفصلة',
    dimensions: '180x200', height: '28 سم', price: 13499, cost: 8200,
    warranty: '12 سنوات', stock: { b1: 4, b2: 2, b3: 1, b4: 0, b5: 12 },
    iconType: 'premium', description: 'مرتبة Serta كينج للراحة الفائقة',
    rating: 4.8, tags: ['فاخرة', 'VIP'],
  },
  {
    id: 'p23', brand: 'Dream Line', model: 'دريم نايت', category: 'فوم',
    dimensions: '160x200', height: '25 سم', price: 8499, cost: 5100,
    warranty: '10 سنوات', stock: { b1: 11, b2: 7, b3: 4, b4: 2, b5: 24 },
    iconType: 'standard', description: 'مرتبة فوم ذكي بطبقات دعم متعددة',
    rating: 4.6, tags: ['ذكية', 'مريحة'],
  },
  {
    id: 'p24', brand: 'Dream Line', model: 'سليبر لوكس', category: 'سوست منفصلة',
    dimensions: '150x200', height: '22 سم', price: 6999, cost: 4200,
    warranty: '8 سنوات', stock: { b1: 17, b2: 12, b3: 8, b4: 5, b5: 35 },
    iconType: 'standard', description: 'مرتبة سوست تقليدية بقيمة ممتازة',
    rating: 4.5, tags: ['اقتصادية', 'جيدة'],
  },

  // --- New additions to reach 30+ ---
  {
    id: 'p25', brand: 'Janssen', model: 'أورثو', category: 'طبية',
    dimensions: '160x200', height: '22 سم', price: 9499, cost: 5800,
    warranty: '10 سنوات', stock: { b1: 8, b2: 5, b3: 3, b4: 2, b5: 18 },
    iconType: 'medical', description: 'مرتبة طبية لتقويم العمود الفقري',
    rating: 4.9, tags: ['طبية', 'تقويم'],
  },
  {
    id: 'p26', brand: 'Taki', model: 'ميديكال', category: 'طبية',
    dimensions: '180x200', height: '24 سم', price: 11499, cost: 7000,
    warranty: '10 سنوات', stock: { b1: 5, b2: 3, b3: 2, b4: 1, b5: 12 },
    iconType: 'medical', description: 'مرتبة طبية فاخرة لدعم الظهر',
    rating: 4.8, tags: ['طبية', 'فاخرة'],
  },
  {
    id: 'p27', brand: 'Forbed', model: 'ماساج', category: 'كهربائية',
    dimensions: '160x200', height: '28 سم', price: 14999, cost: 9000,
    warranty: '10 سنوات', stock: { b1: 3, b2: 2, b3: 1, b4: 0, b5: 8 },
    iconType: 'massage', description: 'مرتبة كهربائية بمساج مدمج وتدفئة',
    rating: 4.9, tags: ['كهربائية', 'VIP', 'مساج'],
  },
  {
    id: 'p28', brand: 'Janssen', model: 'سوبر سوفت', category: 'فوم',
    dimensions: '120x190', height: '18 سم', price: 4499, cost: 2800,
    warranty: '5 سنوات', stock: { b1: 20, b2: 14, b3: 9, b4: 6, b5: 40 },
    iconType: 'standard', description: 'مرتبة فوم ناعمة مفردة',
    rating: 4.4, tags: ['مفردة', 'ناعمة'],
  },
  {
    id: 'p29', brand: 'Taki', model: 'كينج سايز', category: 'سوست منفصلة',
    dimensions: '200x220', height: '30 سم', price: 17999, cost: 10800,
    warranty: '15 سنوات', stock: { b1: 2, b2: 1, b3: 0, b4: 0, b5: 5 },
    iconType: 'premium', description: 'مرتبة كينج سايز ضخمة فاخرة جداً',
    rating: 5.0, tags: ['فاخرة', 'VIP', 'ضخمة'],
  },
  {
    id: 'p30', brand: 'Dream Line', model: 'فوم كينج', category: 'فوم',
    dimensions: '180x200', height: '26 سم', price: 9999, cost: 6000,
    warranty: '10 سنوات', stock: { b1: 7, b2: 4, b3: 3, b4: 2, b5: 16 },
    iconType: 'standard', description: 'مرتبة فوم عالي الكثافة كينج سايز',
    rating: 4.7, tags: ['فوم', 'كينج'],
  },
  {
    id: 'p31', brand: 'Serta', model: 'بريزيدنت', category: 'سوست منفصلة',
    dimensions: '160x200', height: '28 سم', price: 11499, cost: 7000,
    warranty: '12 سنوات', stock: { b1: 6, b2: 3, b3: 2, b4: 1, b5: 14 },
    iconType: 'standard', description: 'مرتبة Serta بريزيدنت الفاخرة',
    rating: 4.8, tags: ['فاخرة', 'أمريكية'],
  },
  {
    id: 'p32', brand: 'Forbed', model: 'بيبي نايت', category: 'فوم',
    dimensions: '70x140', height: '10 سم', price: 2499, cost: 1500,
    warranty: '3 سنوات', stock: { b1: 30, b2: 22, b3: 16, b4: 10, b5: 60 },
    iconType: 'baby', description: 'مرتبة أطفال حديثي الولادة',
    rating: 4.6, tags: ['أطفال', 'بيبي'],
  },
];

// ---- SALES HISTORY (50+ transactions) ----
const today = new Date();
const daysAgo = (d) => {
  const date = new Date(today);
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

export const salesData = [
  { id: 's1', invoice: 'INV-2024-001', date: daysAgo(0), customer: 'أحمد محمود', items: 2, total: 17998, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u2' },
  { id: 's2', invoice: 'INV-2024-002', date: daysAgo(0), customer: 'مريم حسن', items: 1, total: 8499, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's3', invoice: 'INV-2024-003', date: daysAgo(1), customer: 'خالد عبدالله', items: 1, total: 11999, paymentMethod: 'تحويل بنكي', status: 'مكتمل', branch: 'b2', cashier: 'u2' },
  { id: 's4', invoice: 'INV-2024-004', date: daysAgo(1), customer: 'نور الدين علي', items: 3, total: 22497, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's5', invoice: 'INV-2024-005', date: daysAgo(1), customer: 'سامي يوسف', items: 1, total: 7499, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b3', cashier: 'u2' },
  { id: 's6', invoice: 'INV-2024-006', date: daysAgo(2), customer: 'هند أحمد', items: 2, total: 16998, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's7', invoice: 'INV-2024-007', date: daysAgo(2), customer: 'محمد صلاح', items: 1, total: 5499, paymentMethod: 'بطاقة', status: 'مكتمل', branch: 'b4', cashier: 'u2' },
  { id: 's8', invoice: 'INV-2024-008', date: daysAgo(3), customer: 'أسماء كامل', items: 1, total: 15999, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's9', invoice: 'INV-2024-009', date: daysAgo(3), customer: 'عمر عبدالعزيز', items: 2, total: 12998, paymentMethod: 'تحويل بنكي', status: 'مكتمل', branch: 'b2', cashier: 'u2' },
  { id: 's10', invoice: 'INV-2024-010', date: daysAgo(4), customer: 'ليلي طارق', items: 1, total: 6499, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b3', cashier: 'u6' },
  { id: 's11', invoice: 'INV-2024-011', date: daysAgo(4), customer: 'يوسف رضا', items: 1, total: 8499, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u2' },
  { id: 's12', invoice: 'INV-2024-012', date: daysAgo(5), customer: 'حسن علي', items: 2, total: 16998, paymentMethod: 'بطاقة', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's13', invoice: 'INV-2024-013', date: daysAgo(5), customer: 'إيمان شعبان', items: 1, total: 9499, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b2', cashier: 'u2' },
  { id: 's14', invoice: 'INV-2024-014', date: daysAgo(6), customer: 'رامي جمال', items: 3, total: 20997, paymentMethod: 'تحويل بنكي', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's15', invoice: 'INV-2024-015', date: daysAgo(7), customer: 'دينا مصطفى', items: 1, total: 6999, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b3', cashier: 'u2' },
  { id: 's16', invoice: 'INV-2024-016', date: daysAgo(7), customer: 'كريم حامد', items: 2, total: 18998, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's17', invoice: 'INV-2024-017', date: daysAgo(8), customer: 'شيماء جبر', items: 1, total: 3999, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b4', cashier: 'u2' },
  { id: 's18', invoice: 'INV-2024-018', date: daysAgo(8), customer: 'عادل حسين', items: 1, total: 14999, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's19', invoice: 'INV-2024-019', date: daysAgo(9), customer: 'منى سعيد', items: 2, total: 13998, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b2', cashier: 'u2' },
  { id: 's20', invoice: 'INV-2024-020', date: daysAgo(10), customer: 'وليد عبداللطيف', items: 1, total: 7499, paymentMethod: 'تحويل بنكي', status: 'مكتمل', branch: 'b3', cashier: 'u6' },
  { id: 's21', invoice: 'INV-2024-021', date: daysAgo(10), customer: 'فاطمة الزهراء', items: 1, total: 11499, paymentMethod: 'بطاقة', status: 'مكتمل', branch: 'b1', cashier: 'u2' },
  { id: 's22', invoice: 'INV-2024-022', date: daysAgo(12), customer: 'مصطفى كريم', items: 1, total: 7999, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's23', invoice: 'INV-2024-023', date: daysAgo(13), customer: 'إسراء محمود', items: 2, total: 18998, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b2', cashier: 'u2' },
  { id: 's24', invoice: 'INV-2024-024', date: daysAgo(14), customer: 'تامر حسن', items: 1, total: 16999, paymentMethod: 'تحويل بنكي', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's25', invoice: 'INV-2024-025', date: daysAgo(14), customer: 'رنا جمال الدين', items: 1, total: 4499, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b3', cashier: 'u2' },
  { id: 's26', invoice: 'INV-2024-026', date: daysAgo(15), customer: 'أحمد فتحي', items: 2, total: 15998, paymentMethod: 'بطاقة', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's27', invoice: 'INV-2024-027', date: daysAgo(16), customer: 'سماح عبدالرحمن', items: 1, total: 9999, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b4', cashier: 'u2' },
  { id: 's28', invoice: 'INV-2024-028', date: daysAgo(17), customer: 'بسام شوقي', items: 1, total: 8499, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's29', invoice: 'INV-2024-029', date: daysAgo(18), customer: 'غادة فاروق', items: 3, total: 22497, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b2', cashier: 'u2' },
  { id: 's30', invoice: 'INV-2024-030', date: daysAgo(20), customer: 'زياد هشام', items: 1, total: 6499, paymentMethod: 'تحويل بنكي', status: 'مكتمل', branch: 'b3', cashier: 'u6' },
  { id: 's31', invoice: 'INV-2024-031', date: daysAgo(21), customer: 'هالة محمد', items: 2, total: 18998, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u2' },
  { id: 's32', invoice: 'INV-2024-032', date: daysAgo(22), customer: 'جمال فكري', items: 1, total: 7499, paymentMethod: 'بطاقة', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's33', invoice: 'INV-2024-033', date: daysAgo(23), customer: 'نادية عادل', items: 1, total: 12499, paymentMethod: 'فيزا', status: 'مكتمل', branch: 'b2', cashier: 'u2' },
  { id: 's34', invoice: 'INV-2024-034', date: daysAgo(25), customer: 'مجدي سامي', items: 2, total: 13998, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
  { id: 's35', invoice: 'INV-2024-035', date: daysAgo(27), customer: 'سلوى عاطف', items: 1, total: 9499, paymentMethod: 'تحويل بنكي', status: 'مكتمل', branch: 'b3', cashier: 'u2' },
  { id: 's36', invoice: 'INV-2024-036', date: daysAgo(30), customer: 'محمود سعد', items: 1, total: 15999, paymentMethod: 'نقداً', status: 'مكتمل', branch: 'b1', cashier: 'u6' },
];

// ---- AUDIT LOGS ----
export const auditLogsData = [
  { id: 'a1', timestamp: daysAgo(0).replace('T', ' ').substring(0, 19), user: 'أحمد السيد', action: 'تسجيل دخول', entity: 'النظام', description: 'تسجيل دخول إلى النظام', severity: 'info' },
  { id: 'a2', timestamp: daysAgo(0).replace('T', ' ').substring(0, 19), user: 'محمد علي', action: 'بيع', entity: 'فاتورة INV-2024-001', description: 'إتمام عملية بيع لصالح أحمد محمود بقيمة 17,998 ج.م', severity: 'success' },
  { id: 'a3', timestamp: daysAgo(0).replace('T', ' ').substring(0, 19), user: 'محمد علي', action: 'بيع', entity: 'فاتورة INV-2024-002', description: 'إتمام عملية بيع لصالح مريم حسن بقيمة 8,499 ج.م', severity: 'success' },
  { id: 'a4', timestamp: daysAgo(1).replace('T', ' ').substring(0, 19), user: 'سارة خالد', action: 'إضافة مخزون', entity: 'Janssen كومفورت 2000', description: 'إضافة 15 وحدة إلى المخزون', severity: 'info' },
  { id: 'a5', timestamp: daysAgo(1).replace('T', ' ').substring(0, 19), user: 'أحمد السيد', action: 'تعديل', entity: 'سعر المنتج', description: 'تعديل سعر مرتبة Janssen سوبر فيت إلى 11,999 ج.م', severity: 'warning' },
  { id: 'a6', timestamp: daysAgo(2).replace('T', ' ').substring(0, 19), user: 'إبراهيم حسن', action: 'بيع', entity: 'فاتورة INV-2024-006', description: 'إتمام عملية بيع لصالح هند أحمد بقيمة 16,998 ج.م', severity: 'success' },
  { id: 'a7', timestamp: daysAgo(2).replace('T', ' ').substring(0, 19), user: 'خالد عمر', action: 'توصيل', entity: 'طلب توصيل', description: 'تحديث حالة التوصيل إلى "تم التوصيل"', severity: 'success' },
  { id: 'a8', timestamp: daysAgo(3).replace('T', ' ').substring(0, 19), user: 'نورهان أحمد', action: 'طباعة تقرير', entity: 'تقرير مبيعات', description: 'طباعة تقرير مبيعات اليوم', severity: 'info' },
  { id: 'a9', timestamp: daysAgo(3).replace('T', ' ').substring(0, 19), user: 'أحمد السيد', action: 'إضافة مستخدم', entity: 'مستخدم جديد', description: 'إضافة مستخدم جديد: إبراهيم حسن', severity: 'warning' },
  { id: 'a10', timestamp: daysAgo(4).replace('T', ' ').substring(0, 19), user: 'محمد علي', action: 'بيع', entity: 'فاتورة INV-2024-010', description: 'إتمام عملية بيع لصالح ليلي طارق بقيمة 6,499 ج.م', severity: 'success' },
  { id: 'a11', timestamp: daysAgo(4).replace('T', ' ').substring(0, 19), user: 'سارة خالد', action: 'نقل مخزون', entity: 'Janssen كومفورت 2000', description: 'نقل 5 وحدات من المخزن الرئيسي إلى فرع القاهرة', severity: 'warning' },
  { id: 'a12', timestamp: daysAgo(5).replace('T', ' ').substring(0, 19), user: 'خالد عمر', action: 'توصيل', entity: 'طلب توصيل', description: 'بدء عملية توصيل إلى عنوان العميل', severity: 'info' },
  { id: 'a13', timestamp: daysAgo(5).replace('T', ' ').substring(0, 19), user: 'إبراهيم حسن', action: 'بيع', entity: 'فاتورة INV-2024-013', description: 'إتمام عملية بيع لصالح إيمان شعبان بقيمة 9,499 ج.م', severity: 'success' },
  { id: 'a14', timestamp: daysAgo(6).replace('T', ' ').substring(0, 19), user: 'أحمد السيد', action: 'تسجيل خروج', entity: 'النظام', description: 'تسجيل خروج من النظام', severity: 'info' },
  { id: 'a15', timestamp: daysAgo(6).replace('T', ' ').substring(0, 19), user: 'نورهان أحمد', action: 'تحديث', entity: 'ضريبة', description: 'تحديث نسبة ضريبة القيمة المضافة إلى 14%', severity: 'warning' },
  { id: 'a16', timestamp: daysAgo(7).replace('T', ' ').substring(0, 19), user: 'محمد علي', action: 'بيع', entity: 'فاتورة INV-2024-015', description: 'إتمام عملية بيع لصالح دينا مصطفى بقيمة 6,999 ج.م', severity: 'success' },
  { id: 'a17', timestamp: daysAgo(8).replace('T', ' ').substring(0, 19), user: 'سارة خالد', action: 'جرد', entity: 'المخزن الرئيسي', description: 'إتمام جرد المخزون - الفرق 3 وحدات', severity: 'warning' },
  { id: 'a18', timestamp: daysAgo(9).replace('T', ' ').substring(0, 19), user: 'أحمد السيد', action: 'إعدادات', entity: 'النظام', description: 'تعديل إعدادات النظام - تغيير الثيم', severity: 'info' },
  { id: 'a19', timestamp: daysAgo(10).replace('T', ' ').substring(0, 19), user: 'محمد علي', action: 'بيع', entity: 'فاتورة INV-2024-020', description: 'إتمام عملية بيع لصالح وليد عبداللطيف بقيمة 7,499 ج.م', severity: 'success' },
  { id: 'a20', timestamp: daysAgo(12).replace('T', ' ').substring(0, 19), user: 'خالد عمر', action: 'توصيل', entity: 'طلب توصيل', description: 'تأخير في التوصيل بسبب ظروف مرورية', severity: 'danger' },
  { id: 'a21', timestamp: daysAgo(14).replace('T', ' ').substring(0, 19), user: 'إبراهيم حسن', action: 'مرتجع', entity: 'فاتورة INV-2024-025', description: 'مرتجع منتج - مرتبة Taki فاميلي - عيب صناعة', severity: 'danger' },
  { id: 'a22', timestamp: daysAgo(15).replace('T', ' ').substring(0, 19), user: 'أحمد السيد', action: 'تسجيل دخول', entity: 'النظام', description: 'تسجيل دخول إلى النظام عن بُعد', severity: 'info' },
  { id: 'a23', timestamp: daysAgo(18).replace('T', ' ').substring(0, 19), user: 'نورهان أحمد', action: 'تقرير', entity: 'تقرير شهري', description: 'إنشاء التقرير الشهري للمبيعات', severity: 'info' },
  { id: 'a24', timestamp: daysAgo(20).replace('T', ' ').substring(0, 19), user: 'محمد علي', action: 'بيع', entity: 'فاتورة INV-2024-030', description: 'إتمام عملية بيع لصالح زياد هشام بقيمة 6,499 ج.م', severity: 'success' },
  { id: 'a25', timestamp: daysAgo(22).replace('T', ' ').substring(0, 19), user: 'سارة خالد', action: 'إضافة منتج', entity: 'منتج جديد', description: 'إضافة منتج جديد: Forbed ماساج', severity: 'info' },
];

// ---- SUPPLIERS ----
export const suppliersData = [
  { id: 'sup1', name: 'شركة جانسن للمفروشات', phone: '01012345678', address: 'المنطقة الصناعية - العاشر من رمضان', balance: 0 },
  { id: 'sup2', name: 'مصنع تاكي للمراتب', phone: '01023456789', address: 'المنطقة الصناعية - مدينة بدر', balance: 0 },
  { id: 'sup3', name: 'شركة فوربيد المحدودة', phone: '01034567890', address: 'شارع الصناعات - العبور', balance: 0 },
  { id: 'sup4', name: 'وكالة Serta مصر', phone: '01045678901', address: 'المنطقة الحرة - نصر city', balance: 0 },
  { id: 'sup5', name: 'شركة دريم لاين', phone: '01056789012', address: 'المنطقة الصناعية - السادس من أكتوبر', balance: 0 },
];

// Purchase Invoices state counter
let purchaseInvIdCounter = 1;

export const purchaseInvoicesData = [
  {
    id: 'pi1',
    invoiceNumber: 'PUR-2024-001',
    supplierId: 'sup1',
    supplierName: 'شركة جانسن للمفروشات',
    date: daysAgo(5),
    items: [
      { productId: 'p1', productName: 'كومفورت 2000', brand: 'Janssen', quantity: 20, unitPrice: 5500, total: 110000 },
      { productId: 'p2', productName: 'سوبر فيت', brand: 'Janssen', quantity: 15, unitPrice: 7200, total: 108000 },
    ],
    totalAmount: 218000,
    paidAmount: 218000,
    status: 'مسددة', // مدفوعة بالكامل
    notes: 'فاتورة شهر يناير',
  },
  {
    id: 'pi2',
    invoiceNumber: 'PUR-2024-002',
    supplierId: 'sup2',
    supplierName: 'مصنع تاكي للمراتب',
    date: daysAgo(3),
    items: [
      { productId: 'p8', productName: 'جراند', brand: 'Taki', quantity: 25, unitPrice: 5200, total: 130000 },
      { productId: 'p9', productName: 'لوكس', brand: 'Taki', quantity: 10, unitPrice: 6800, total: 68000 },
    ],
    totalAmount: 198000,
    paidAmount: 100000,
    status: 'مدفوع جزئياً',
    notes: 'باقي 98,000 ج.م',
  },
];

export const getNextPurchaseInvId = () => `pi${++purchaseInvIdCounter}`;

// ---- LOGISTICS ----
export const logisticsData = [
  { id: 'l1', invoice: 'INV-2024-001', customer: 'أحمد محمود', address: 'شارع 9، مدينة نصر، القاهرة', phone: '01011111111', status: 'تم التوصيل', driver: 'خالد عمر', branch: 'b1', date: daysAgo(0), items: 2, note: 'تم التسليم بنجاح' },
  { id: 'l2', invoice: 'INV-2024-003', customer: 'خالد عبدالله', address: 'شارع سيدي جابر، الإسكندرية', phone: '01022222222', status: 'تم التوصيل', driver: 'خالد عمر', branch: 'b2', date: daysAgo(1), items: 1, note: 'تسليم للبوابة' },
  { id: 'l3', invoice: 'INV-2024-005', customer: 'سامي يوسف', address: 'شارع الهرم، الجيزة', phone: '01033333333', status: 'قيد التوصيل', driver: 'خالد عمر', branch: 'b3', date: daysAgo(1), items: 1, note: 'في الطريق' },
  { id: 'l4', invoice: 'INV-2024-006', customer: 'هند أحمد', address: 'شارع التسعين، التجمع الخامس', phone: '01044444444', status: 'قيد التوصيل', driver: 'خالد عمر', branch: 'b1', date: daysAgo(2), items: 2, note: 'سيتم التسليم اليوم' },
  { id: 'l5', invoice: 'INV-2024-008', customer: 'أسماء كامل', address: 'شارع النزهة، مصر الجديدة', phone: '01055555555', status: 'قيد الانتظار', driver: null, branch: 'b1', date: daysAgo(3), items: 1, note: 'في انتظار تأكيد العميل' },
  { id: 'l6', invoice: 'INV-2024-010', customer: 'ليلي طارق', address: 'شارع النصر، المنصورة', phone: '01066666666', status: 'قيد التوصيل', driver: 'خالد عمر', branch: 'b4', date: daysAgo(4), items: 1, note: 'تم تحميل الشحنة' },
  { id: 'l7', invoice: 'INV-2024-012', customer: 'حسن علي', address: 'شارع فيصل، الجيزة', phone: '01077777777', status: 'تم التوصيل', driver: 'خالد عمر', branch: 'b3', date: daysAgo(5), items: 2, note: 'تسليم ناجح' },
  { id: 'l8', invoice: 'INV-2024-016', customer: 'كريم حامد', address: 'شارع جامعة الدول، المهندسين', phone: '01088888888', status: 'قيد الانتظار', driver: null, branch: 'b1', date: daysAgo(7), items: 2, note: 'في انتظار التحميل' },
  { id: 'l9', invoice: 'INV-2024-018', customer: 'عادل حسين', address: 'شارع أحمد عرابي، القاهرة', phone: '01099999999', status: 'قيد التوصيل', driver: 'خالد عمر', branch: 'b1', date: daysAgo(8), items: 1, note: 'تم الشحن' },
  { id: 'l10', invoice: 'INV-2024-021', customer: 'فاطمة الزهراء', address: 'شارع البحر الأعظم, الجيزة', phone: '01010101010', status: 'مرتجع', driver: 'خالد عمر', branch: 'b3', date: daysAgo(10), items: 1, note: 'العميل رفض الاستلام' },
  { id: 'l11', invoice: 'INV-2024-025', customer: 'رنا جمال الدين', address: 'شارع الجمهورية، المنصورة', phone: '01011121314', status: 'مرتجع', driver: 'خالد عمر', branch: 'b4', date: daysAgo(14), items: 1, note: 'عيب صناعة - تم الاسترجاع' },
  { id: 'l12', invoice: 'INV-2024-030', customer: 'زياد هشام', address: 'شارع الحرية، الإسكندرية', phone: '01015161718', status: 'تم التوصيل', driver: 'خالد عمر', branch: 'b2', date: daysAgo(20), items: 1, note: 'تسليم ناجح' },
];
