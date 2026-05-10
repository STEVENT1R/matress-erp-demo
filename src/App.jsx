import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import POSPage from './pages/POSPage';
import Inventory from './pages/Inventory';
import AuditLogPage from './pages/AuditLogPage';
import Logistics from './pages/Logistics';
import Products from './pages/Products';
import SalesHistory from './pages/SalesHistory';
import FinancialRecords from './pages/FinancialRecords';
import PurchaseInvoices from './pages/PurchaseInvoices';
import Branches from './pages/Branches';

export default function App() {
  return (
    <>
      <Toaster
        position="top-left"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Cairo, sans-serif',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<SalesHistory />} />
          <Route path="audit-log" element={<AuditLogPage />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="purchases" element={<PurchaseInvoices />} />
          <Route path="finances" element={<FinancialRecords />} />
          <Route path="branches" element={<Branches />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
