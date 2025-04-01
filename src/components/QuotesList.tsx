
import React, { useRef, useState } from "react";
import { Quote } from "../types";
import { Container, List, ListItemText, Tabs, Tab, Paper, IconButton, Menu, MenuItem, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { deleteQuote, fetchQuotes } from "../actions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Header } from "./QuoteForm"

const QuotesList = ({ setShowList, setEditQuoteData }: { setShowList: (show: boolean) => void, setEditQuoteData: (quote: Quote | null) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const quotes = useSelector((state: any) => state.quotes);
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const quoteFormRef = useRef<{ resetForm: () => void } | null>(null);
  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, quote: Quote) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuote(quote);
  };

  const handleEditQuote = () => {
    setEditQuoteData(selectedQuote);
    setShowList(false);
  };

  const handleResetForm = () => {
    if (quoteFormRef.current) {
      quoteFormRef.current.resetForm();
    }
  };

  const handleDeleteQuote = () => {
    if (selectedQuote) {
      dispatch(deleteQuote(selectedQuote.id));
    }
    setAnchorEl(null);
  };

  const formatDate = (dateString: Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth={false} sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Header title="Edit Quote" onCreate={() => setShowList(false)} resetForm={handleResetForm} showCreateButton={true} />
      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ flexShrink: 0 }}>
        <Tab label="All" sx={{ fontSize: "1.2rem", color: "inherit", "&.Mui-selected": { color: "#FFA500" } }} />
      </Tabs>
      <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
        <List>
          {quotes.map((q: Quote) => (
            <Paper variant="outlined" sx={{ marginBottom: 2, padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }} key={q.id}>
              <ListItemText
                primary={q.quote}
                secondary={
                  <>
                    <Typography variant="body2" component="div">{q.quoteAuthor}</Typography>
                    <Typography variant="body2" component="div">
                      {`Scheduled: ${(Array.isArray(q.scheduledDates) ? q.scheduledDates : [])
                        .map(date => formatDate(date))
                        .join(", ")}`}
                    </Typography>
                  </>
                }
              />
              <IconButton onClick={(e) => handleMenuClick(e, q)}>
                <MoreVertIcon />
              </IconButton>
            </Paper>
          ))}
        </List>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleEditQuote}>Edit Quote</MenuItem>
        <MenuItem onClick={handleDeleteQuote} sx={{ color: "red" }}>Delete Quote</MenuItem>
      </Menu>
    </Container>
  );
};
export default QuotesList;