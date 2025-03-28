import React, { useState } from 'react';
import QuoteForm from './components/QuoteForm'
import QuotesList from './components/QuotesList'
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { Quote } from './types';

export default function App() {
  const [showList, setShowList] = useState(false);
  const [editQuoteData, setEditQuoteData] = useState<Quote | null>(null);
  return (
    <Provider store={store}>
      {showList ? <QuotesList setShowList={setShowList} setEditQuoteData={setEditQuoteData} /> : <QuoteForm setShowList={setShowList} editQuoteData={editQuoteData} setEditQuoteData={setEditQuoteData} />}
    </Provider>
  );
}

