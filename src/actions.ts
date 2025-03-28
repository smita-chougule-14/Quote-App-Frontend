import { createAsyncThunk } from "@reduxjs/toolkit";
import { Quote } from "./types";

const API_URL = "http://localhost:3000/quotes";

export const fetchQuotes = createAsyncThunk("quotes/fetchQuotes", async () => {
  const response = await fetch(API_URL);
  return await response.json();
});

export const addQuote = createAsyncThunk("quotes/addQuote", async (quote: Omit<Quote, "id">) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote),
  });
  return await response.json();
});

export const editQuote = createAsyncThunk(
    "quotes/editQuote",
    async (quote: Quote) => {
      const response = await fetch(`${API_URL}/${quote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quote),
      });
      return await response.json();
    }
);

export const deleteQuote = createAsyncThunk(
    "quotes/deleteQuote",
    async (quoteId: number) => {
      await fetch(`${API_URL}/${quoteId}`, {
        method: "DELETE",
      });
      return quoteId;
    }
  );
  

