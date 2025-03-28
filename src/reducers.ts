// import { createReducer } from "@reduxjs/toolkit";
// import { addQuote, editQuote } from "./actions";
// import { Quote } from "./types";

// const initialState: Quote[] = [];

// const quotesReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase(addQuote, (state, action) => {
//       state.push(action.payload);
//     })
//     .addCase(editQuote, (state, action) => {
//       const index = state.findIndex((q) => q.id === action.payload.id);
//       if (index !== -1) state[index] = action.payload;
//     });
// });

// export default quotesReducer;

import { createSlice } from "@reduxjs/toolkit";
import { fetchQuotes, addQuote, deleteQuote, editQuote } from "./actions";
import { Quote } from "./types";

const quotesSlice = createSlice({
  name: "quotes",
  initialState: [] as Quote[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuotes.fulfilled, (state, action) => {
      return action.payload;
    });
    
    builder.addCase(addQuote.fulfilled, (state, action) => {
      state.push(action.payload);
    });

    builder.addCase(editQuote.fulfilled, (state, action) => {
      const index = state.findIndex((quote) => quote.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload; // Update the existing quote
      }
    });
    
    builder.addCase(deleteQuote.fulfilled, (state, action) => {
      return state.filter((quote) => quote.id !== action.payload);
    });
    
    
  },
});

export default quotesSlice.reducer;
