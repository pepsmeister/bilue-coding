import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      // Prevent duplicate addresses by id
      console.log("Adding address:", action.payload);
      console.log("Current addresses:", state.addresses);
      const isAddressExists = state.addresses.some(addr => addr === action.payload);
      if (!isAddressExists) {
        state.addresses.push(action.payload);
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      console.log("Removing address:", action.payload);
      console.log("Current addresses:", state.addresses);
      const index = state.addresses.findIndex(addr => addr.id === action.payload);
      if (index !== -1) {
        state.addresses.splice(index, 1);
      }
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export default addressBookSlice.reducer;
