import { configureStore } from "@reduxjs/toolkit";
import quotesReducer from "./reducers";

const store = configureStore({
  reducer: {
    quotes: quotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;  // Define AppDispatch

export default store;
