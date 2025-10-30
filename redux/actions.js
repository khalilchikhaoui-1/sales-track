// ===== Business =====
export const setSelectedBusiness = (business) => ({
  type: "SET_SELECTED_BUSINESS",
  payload: business,
});

// ===== Temp =====
export const setScannedCode = (code) => ({
  type: "SET_SCANNED_CODE",
  payload: code,
});

export const clearScannedCode = () => ({
  type: "CLEAR_SCANNED_CODE",
});

// ===== Invoice =====
export const setInvoiceClient = (client) => ({
  type: "SET_INVOICE_CLIENT",
  payload: client,
});


export const addInvoiceItem = (item) => ({
  type: "ADD_INVOICE_ITEM",
  payload: item,
});


export const removeInvoiceItemById = (lineId) => ({
  type: "REMOVE_INVOICE_ITEM_BY_ID",
  payload: lineId,
});

export const updateInvoiceItem = (index, data) => ({
  type: "UPDATE_INVOICE_ITEM",
  payload: { index, data },
});

export const setInvoiceDiscountRate = (rate) => ({
  type: "SET_INVOICE_DISCOUNT_RATE",
  payload: rate,
});

export const setInvoiceDiscountType = (type) => ({
  type: "SET_INVOICE_DISCOUNT_TYPE",
  payload: type,
});

export const setInvoiceTax = (percent) => ({
  type: "SET_INVOICE_TAX",
  payload: percent,
});



export const setInvoiceStatus = (status) => ({
  type: "SET_INVOICE_STATUS",
  payload: status,
});

export const setInvoiceNotes = (notes) => ({
  type: "SET_INVOICE_NOTES",
  payload: notes,
});

export const resetInvoice = () => ({
  type: "RESET_INVOICE",
});

export const addInvoiceItemFromSelection = ({
  productId,
  name,
  price,
  qty,
  is_service,
}) => {
  const lineId =
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const p = Number(price) || 0;
  const q = Number(qty) || 0;
  const subtotal = +(p * q).toFixed(2);

  return {
    type: "ADD_INVOICE_ITEM",
    payload: { lineId, productId, name, price: p, qty: q, subtotal, is_service: !!is_service },
  };
};