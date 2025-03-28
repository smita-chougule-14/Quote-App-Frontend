import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../store";
import { addQuote, editQuote } from "../actions";
import { Quote } from "../types";
import { Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Box, IconButton, Chip, Snackbar, Alert } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AppDispatch } from "../store";

export const Header = ({ title, onCreate, resetForm, showCreateButton }: { title: string; onCreate?: () => void; resetForm: () => void; showCreateButton?: boolean }) => (
  <AppBar position="static" sx={{ backgroundColor: "#4B0082" }}>
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h4">{title}</Typography>
      {showCreateButton && (
        <Button sx={{ fontSize: "1rem", padding: "12px 24px" }} color="inherit" onClick={() => { resetForm(); onCreate && onCreate(); }} size="large">
          Create Quote
        </Button>
      )}
    </Toolbar>
  </AppBar>
);

const generateRandomId = (): number => {
  return Math.floor(Math.random() * 1000000);
};

const QuoteForm = forwardRef(({ setShowList, editQuoteData, setEditQuoteData }: { setShowList: (show: boolean) => void, editQuoteData?: Quote | null, setEditQuoteData: (quote: Quote | null) => void }, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const [quote, setQuote] = useState(editQuoteData?.quote || "");
  const [quoteAuthor, setQuoteAuthor] = useState(editQuoteData?.quoteAuthor || "");
  const [scheduledDates, setScheduledDates] = useState<Date[]>(editQuoteData?.scheduledDates || []);
  const [openDiscardDialog, setOpenDiscardDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  useEffect(() => {
    if (editQuoteData) {
      setQuote(editQuoteData.quote);
      setQuoteAuthor(editQuoteData.quoteAuthor);
      setScheduledDates(
        editQuoteData.scheduledDates.map(date => new Date(date)) // Convert strings to Date objects
      );
    } else {
      resetForm(); // Reset form explicitly when editQuoteData is null
    }
  }, [editQuoteData]);

  const resetForm = () => {
    setQuote("");
    setQuoteAuthor("");
    setScheduledDates([]);
  };

  useImperativeHandle(ref, () => ({
    resetForm
  }));


  const handleAddDate = (newDate: Date | null) => {
    if (newDate && !scheduledDates.some(date => date.getTime() === newDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate >= today && scheduledDates.length < 5) {
        const utcDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));
         setScheduledDates([...scheduledDates, utcDate]);
      }
    }
  };

  const handleRemoveDate = (index: number) => {
    setScheduledDates(scheduledDates.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!scheduledDates.length) return;
    const newQuote: Quote = { id: editQuoteData ? editQuoteData.id : generateRandomId(), quote, quoteAuthor, scheduledDates};
    if (editQuoteData) {
      dispatch(editQuote(newQuote));
      setEditQuoteData(null);
    } else {
      dispatch(addQuote(newQuote));
      setEditQuoteData(null);
    }
    setSnackbarMessage(editQuoteData ? "Quote edited successfully!" : "Quote added to library successfully!");
    setOpenSnackbar(true);
    setTimeout(() => {
      setShowList(true);
      resetForm();
    }, 2000);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Header title={editQuoteData ? "Edit Quote" : "Create Quote"} resetForm={resetForm} />
      <Dialog open={true} maxWidth="md" fullWidth sx={{ overflowX: "hidden" }}>
        <DialogTitle>{editQuoteData ? "Edit Quote" : "Add Quote"}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">
            Quote<span style={{ color: "red" }}> *</span>
          </Typography>
          <TextField label="Enter the Quote here" fullWidth margin="dense" value={quote} onChange={e => setQuote(e.target.value)} multiline rows={4} inputProps={{ maxLength: 256 }} />
          <Typography variant="subtitle1">Quote Author<span style={{ color: "red" }}> *</span></Typography>
          <TextField label="Enter quote author name" fullWidth margin="dense" value={quoteAuthor} onChange={e => setQuoteAuthor(e.target.value)} inputProps={{ maxLength: 100 }} />
          <Typography variant="subtitle1">Schedule Dates (Add up-to 5 Dates)<span style={{ color: "red" }}> *</span></Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select one or more dates to schedule quotes"
              onChange={handleAddDate}
              shouldDisableDate={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
          </LocalizationProvider>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {scheduledDates.map((date, index) => (
              <Chip
                key={index}
                label={new Date(date).toDateString()}
                onDelete={() => handleRemoveDate(index)}
                color="primary"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ width: "100%", display: "flex", gap: 2, justifyContent: "center", padding: 2 }}>
            <Button sx={{ flex: 1, minWidth: "200px", maxWidth: "300px", borderColor: "#ff6633", color: "#ff6633" }} variant="outlined" onClick={() => setOpenDiscardDialog(true)}>Discard</Button>
            <Button sx={{ flex: 1, minWidth: "200px", maxWidth: "300px", backgroundColor: "#ff6633", color: "white" }} onClick={handleSubmit} variant="contained" color="primary">{editQuoteData ? "Update Quote" : "Add to Library"}</Button>
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog open={openDiscardDialog} onClose={() => setOpenDiscardDialog(false)}>
        <DialogTitle>{editQuoteData ? "Discard editing Quote?" : "Discard Quote creation?"}</DialogTitle>
        <DialogContent>
          <Typography>{editQuoteData ? "Are you sure you want to cancel editing Quote, you will lose all your changes here" : "Are you sure you want to cancel Quote creation? You will lose all your data added here"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDiscardDialog(false)}>Cancel</Button>
          <Button onClick={() => { setEditQuoteData(null); resetForm(); setShowList(true) }} color="error">Confirm</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "500px", height: "40px", fontSize: "1rem", display: "flex", alignItems: "center" }}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
});
export default QuoteForm;