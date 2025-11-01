import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SelectedBusiness = {
  uid: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  membershipId?: string;
  business: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    image?: string;
    address?: {
      street?: string;
      number?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
    currency?: {
      code: string;
      symbol?: string;
      decimals?: number;
      display?: "symbol" | "code";
      direction?: "ltr" | "rtl";
    };
    createdAt?: string;
    updatedAt?: string;
  };
};

type State = {
  selectedBusiness: SelectedBusiness | null;
};

const initialState: State = {
  selectedBusiness: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setSelectedBusiness(state, action: PayloadAction<SelectedBusiness>) {
      state.selectedBusiness = action.payload;
    },
    clearSelectedBusiness(state) {
      state.selectedBusiness = null;
    },
  },
});

export const { setSelectedBusiness, clearSelectedBusiness } = businessSlice.actions;
export default businessSlice.reducer;

// Selectors
export const selectSelectedBusiness = (s: { business: State }) =>
  s.business.selectedBusiness;
export const selectSelectedBusinessId = (s: { business: State }) =>
  s.business.selectedBusiness?.business?._id ?? null;
export const selectRole = (s: { business: State }) =>
  s.business.selectedBusiness?.role ?? null;
