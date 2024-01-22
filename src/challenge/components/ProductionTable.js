import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";

const ProductionTable = ({ productions, setWatched }) => {
  const [watchedModalOpen, setWatchedModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [watchDate, setWatchDate] = useState(new Date());
  const [reviewText, setReviewText] = useState("");

  const handleWatchedClick = (production) => {
    setSelectedProduction(production);
    setWatchedModalOpen(true);
  };

  const handleReviewClick = (production) => {
    setSelectedProduction(production);
    setReviewModalOpen(true);
  };

  const handleWatchDateChange = (date) => {
    setWatchDate(date);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleWatchedConfirm = () => {
    if (selectedProduction) {
      setWatched({
        id: selectedProduction._id,
        watch_date: watchDate,
      });
      setWatchedModalOpen(false);
      setSelectedProduction(null);
    }
  };

  const handleReviewConfirm = () => {
    if (selectedProduction) {
      setWatched({
        id: selectedProduction._id,
        review: reviewText,
      });
      setReviewModalOpen(false);
      setSelectedProduction(null);
      setReviewText("");
    }
  };

  const handleModalClose = () => {
    setWatchedModalOpen(false);
    setReviewModalOpen(false);
    setSelectedProduction(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Length</TableCell>
            <TableCell>Season</TableCell>
            <TableCell>Episode</TableCell>
            <TableCell>Episode Title</TableCell>
            <TableCell>Watched</TableCell>
            <TableCell>Reviewed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productions.map((production) => (
            <TableRow key={production.id}>
              <TableCell>{production.title}</TableCell>
              <TableCell>{production.length}</TableCell>
              <TableCell>{production.season || "-"}</TableCell>
              <TableCell>{production.episode || "-"}</TableCell>
              <TableCell>{production.episode_title || "-"}</TableCell>
              <TableCell>
                <Button
                  variant={
                    production.watch_dates.length ? "outlined" : "contained"
                  }
                  onClick={() => handleWatchedClick(production)}
                >
                  {production.watch_dates.length ? "Rewatch" : "Watch"}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant={production.review ? "outlined" : "contained"}
                  color='secondary'
                  onClick={() => handleReviewClick(production)}
                >
                  {production.review ? "Remake a review" : "Review"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Watched Modal */}
      <Dialog open={watchedModalOpen} onClose={handleModalClose}>
        <DialogTitle>Watched Date</DialogTitle>
        <DialogContent>
          <TextField
            label='Watched Date'
            type='date'
            defaultValue={watchDate.toISOString().split("T")[0]}
            onChange={(e) => handleWatchDateChange(new Date(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleWatchedConfirm} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onClose={handleModalClose}>
        <DialogTitle>Review</DialogTitle>
        <DialogContent>
          <TextField
            label='Review'
            multiline
            rows={4}
            value={reviewText}
            onChange={handleReviewTextChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleReviewConfirm} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ProductionTable;
