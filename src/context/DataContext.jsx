import { createContext, useContext, useState, useCallback } from 'react';
import { productsData, branchesData, salesData, auditLogsData, logisticsData, usersData, suppliersData, purchaseInvoicesData, getNextPurchaseInvId } from '../data/mockData';

const DataContext = createContext();

let productIdCounter = 33; // Continue from mock data IDs
let logisticsIdCounter = 13; // Continue from mock data IDs

let saleIdCounter = 37; // Continue from mock data IDs (last sale ID is s36)

let customSupplierIdCounter = 1;
let customProductIdCounter = 1;

export function DataProvider({ children }) {
  const [products, setProducts] = useState(productsData);
  const [branches] = useState(branchesData);
  const [sales, setSales] = useState(salesData);
  const [auditLogs] = useState(auditLogsData);
  const [logistics, setLogistics] = useState(logisticsData);
  const [users] = useState(usersData);
  const [suppliers] = useState(suppliersData);
  const [purchaseInvoices, setPurchaseInvoices] = useState(purchaseInvoicesData);
  const [customSuppliers, setCustomSuppliers] = useState([]); // { id, name }
  const [customProductNames, setCustomProductNames] = useState([]); // { id, name }

  // Product CRUD
  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: `p${productIdCounter++}`,
      rating: product.rating || 4.0,
      tags: product.tags || [],
      stock: product.stock || branchesData.reduce((acc, b) => ({ ...acc, [b.id]: 0 }), {}),
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }, [branches]);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Logistics CRUD
  const addLogistics = useCallback((item) => {
    const newItem = {
      ...item,
      id: `l${logisticsIdCounter++}`,
    };
    setLogistics((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  const updateLogistics = useCallback((id, updates) => {
    setLogistics((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const deleteLogistics = useCallback((id) => {
    setLogistics((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // Sale CRUD
  const addSale = useCallback((sale) => {
    const newSale = {
      ...sale,
      id: `s${saleIdCounter++}`,
    };
    setSales((prev) => [newSale, ...prev]);
    return newSale;
  }, []);

  // Get unique values
  const getAllBrands = useCallback(() => {
    return [...new Set(products.map((p) => p.brand))];
  }, [products]);

  const getAllCategories = useCallback(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const getAllTags = useCallback(() => {
    const allTags = products.flatMap((p) => p.tags);
    return [...new Set(allTags)];
  }, [products]);

  const getBranchName = useCallback((branchId) => {
    const branch = branchesData.find((b) => b.id === branchId);
    return branch ? branch.name : '';
  }, []);

  // Purchase Invoice CRUD
  const addPurchaseInvoice = useCallback((invoice) => {
    const newInvoice = {
      ...invoice,
      id: getNextPurchaseInvId(),
    };
    setPurchaseInvoices((prev) => [newInvoice, ...prev]);

    // Automatically add items to product stock (المخزن الرئيسي b5)
    invoice.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.productId) {
            const currentStock = p.stock['b5'] || 0;
            return {
              ...p,
              stock: { ...p.stock, b5: currentStock + item.quantity },
            };
          }
          return p;
        })
      );
    });
    return newInvoice;
  }, []);

  const updatePurchaseInvoice = useCallback((id, updates) => {
    setPurchaseInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))
    );
  }, []);

  const deletePurchaseInvoice = useCallback((id) => {
    setPurchaseInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  // Custom Supplier CRUD
  const addCustomSupplier = useCallback((name) => {
    const newSupplier = {
      id: `cs${customSupplierIdCounter++}`,
      name,
    };
    setCustomSuppliers((prev) => [...prev, newSupplier]);
    return newSupplier;
  }, []);

  const deleteCustomSupplier = useCallback((id) => {
    setCustomSuppliers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Custom Product Name CRUD
  const addCustomProductName = useCallback((name) => {
    // Check if already exists (case-insensitive)
    const existing = customProductNames.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const newProduct = {
      id: `cp${customProductIdCounter++}`,
      name,
    };
    setCustomProductNames((prev) => [...prev, newProduct]);
    return newProduct;
  }, [customProductNames]);

  const deleteCustomProductName = useCallback((id) => {
    setCustomProductNames((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = {
    products,
    branches,
    sales,
    auditLogs,
    logistics,
    users,
    suppliers,
    purchaseInvoices,
    customSuppliers,
    customProductNames,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    addLogistics,
    updateLogistics,
    deleteLogistics,
    getAllBrands,
    getAllCategories,
    getAllTags,
    getBranchName,
    addPurchaseInvoice,
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    addCustomSupplier,
    deleteCustomSupplier,
    addCustomProductName,
    deleteCustomProductName,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
