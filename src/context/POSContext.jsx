import { createContext, useContext, useReducer, useCallback } from 'react';
import { useData } from './DataContext';

const POSContext = createContext();

const initialState = {
  cartItems: [],
  discount: 0,
  discountType: 'amount', // 'amount' | 'percent'
  paymentTerm: 'full', // 'full' | 'deposit'
  depositAmount: 0,
  customerName: '',
  customerPhone: '',
  sellerId: '',
  sellerName: '',
  activeBranch: null,
  searchQuery: '',
  searchFilters: { brand: '', size: '', height: '' },
};


const VAT_RATE = 0.14;

function posReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cartItems.find((item) => item.id === action.product.id);
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + (action.quantity || 1) }
              : item
          ),
        };
      }
      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          { ...action.product, quantity: action.quantity || 1 },
        ],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.id
            ? { ...item, quantity: Math.max(1, action.quantity) }
            : item
        ),
      };
    case 'SET_DISCOUNT':
      return { ...state, discount: Math.max(0, action.value) };
    case 'SET_DISCOUNT_TYPE':
      return { ...state, discountType: action.typeValue };
    case 'SET_PAYMENT_TERM':
      return { ...state, paymentTerm: action.term };
    case 'SET_DEPOSIT':
      return { ...state, depositAmount: Math.max(0, action.value) };
    case 'SET_SELLER':
      return {
        ...state,
        sellerId: action.sellerId,
        sellerName: action.sellerName,
      };
    case 'SET_CUSTOMER':
      return {
        ...state,
        customerName: action.name,
        customerPhone: action.phone,
      };
    case 'SET_BRANCH':
      return { ...state, activeBranch: action.branch };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'SET_SEARCH_FILTER':
      return {
        ...state,
        searchFilters: { ...state.searchFilters, [action.key]: action.value },
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        discount: 0,
        discountType: 'amount',
        paymentTerm: 'full',
        depositAmount: 0,
        customerName: '',
        customerPhone: '',
      };
    default:
      return state;
  }
}

export function POSProvider({ children }) {
  const { branches, products, users } = useData();
  const [state, dispatch] = useReducer(posReducer, {
    ...initialState,
    activeBranch: branches[0] || null,
  });

  const subtotal = state.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountValue =
    state.discountType === 'percent'
      ? subtotal * (state.discount / 100)
      : state.discount;

  const netAfterDiscount = subtotal - discountValue;
  const vat = netAfterDiscount * VAT_RATE;
  const total = netAfterDiscount + vat;
  const remaining = total - state.depositAmount;

  const addToCart = useCallback(
    (product, quantity = 1) =>
      dispatch({ type: 'ADD_TO_CART', product, quantity }),
    []
  );
  const removeFromCart = useCallback(
    (id) => dispatch({ type: 'REMOVE_FROM_CART', id }),
    []
  );
  const updateQuantity = useCallback(
    (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
    []
  );
  const setDiscount = useCallback(
    (value) => dispatch({ type: 'SET_DISCOUNT', value }),
    []
  );
  const setDiscountType = useCallback(
    (typeValue) => dispatch({ type: 'SET_DISCOUNT_TYPE', typeValue }),
    []
  );
  const setPaymentTerm = useCallback(
    (term) => dispatch({ type: 'SET_PAYMENT_TERM', term }),
    []
  );
  const setDeposit = useCallback(
    (value) => dispatch({ type: 'SET_DEPOSIT', value }),
    []
  );
  const setCustomer = useCallback(
    (name, phone) => dispatch({ type: 'SET_CUSTOMER', name, phone }),
    []
  );
  const setSeller = useCallback(
    (sellerId, sellerName) => dispatch({ type: 'SET_SELLER', sellerId, sellerName }),
    []
  );
  const setBranch = useCallback(
    (branch) => dispatch({ type: 'SET_BRANCH', branch }),
    []
  );
  const setSearch = useCallback(
    (query) => dispatch({ type: 'SET_SEARCH', query }),
    []
  );
  const setSearchFilter = useCallback(
    (key, value) => dispatch({ type: 'SET_SEARCH_FILTER', key, value }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const value = {
    ...state,
    subtotal,
    discountValue,
    netAfterDiscount,
    vat,
    total,
    remaining,
    addToCart,
    removeFromCart,
    updateQuantity,
    setDiscount,
    setDiscountType,
    setPaymentTerm,
    setDeposit,
    setCustomer,
    setSeller,
    setBranch,
    setSearch,
    setSearchFilter,
    clearCart,
    VAT_RATE,
    branches,
    products,
    users,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error('usePOS must be used within POSProvider');
  return ctx;
}
