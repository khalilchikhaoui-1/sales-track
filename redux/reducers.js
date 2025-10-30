// redux/reducers.js
const initialState = {
  selectedBusiness: null,
};

export const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_BUSINESS":
      return { ...state, selectedBusiness: action.payload };
    default:
      return state;
  }
};

// 👇 NEW: holds short-lived UI state like the scanned barcode
const initialTemp = {
  scannedCode: null,
};

export const tempReducer = (state = initialTemp, action) => {
  switch (action.type) {
    case "SET_SCANNED_CODE":
      return { ...state, scannedCode: action.payload };
    case "CLEAR_SCANNED_CODE":
      return { ...state, scannedCode: null };
    default:
      return state;
  }
};

const initialInvoice = {
  client: null, // <-- NEW: full client object for UI
  items: [], // each item: { id, name, qty, unit_price, ... }
  discountType: "value",
  discountRate: 0,
  taxPercent: 0,
  status: "pending",
  notes: "",
};

export const invoiceReducer = (state = initialInvoice, action) => {
  switch (action.type) {
    case "SET_INVOICE_CLIENT": {
      const client = action.payload || null; // payload is full client or null
      return {
        ...state,
        client,
      };
    }

    case "ADD_INVOICE_ITEM":
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_INVOICE_ITEM_BY_ID":
      return {
        ...state,
        items: state.items.filter((it) => it.lineId !== action.payload),
      };

    case "UPDATE_INVOICE_ITEM":
      return {
        ...state,
        items: state.items.map((item, idx) =>
          idx === action.payload.index
            ? { ...item, ...action.payload.data }
            : item
        ),
      };

    case "SET_INVOICE_DISCOUNT_TYPE":
      return {
        ...state,
        discountType: action.payload,
      };
    case "SET_INVOICE_DISCOUNT_RATE":
      return {
        ...state,
        discountRate: action.payload,
      };

    case "SET_INVOICE_TAX":
      return {
        ...state,
        taxPercent: action.payload,
      };

    case "SET_INVOICE_STATUS":
      return { ...state, status: action.payload };

    case "SET_INVOICE_NOTES":
      return { ...state, notes: action.payload };

    case "RESET_INVOICE":
      return initialInvoice;

    default:
      return state;
  }
};
