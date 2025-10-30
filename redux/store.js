// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { businessReducer, invoiceReducer, tempReducer } from './reducers'; // 👈 import tempReducer

export const store = configureStore({
  reducer: {
    business: businessReducer,
    temp: tempReducer, 
    invoice: invoiceReducer,
  },
});
