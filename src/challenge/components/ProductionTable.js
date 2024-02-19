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
  Switch,
  FormControlLabel,
} from "@material-ui/core";

const ProductionTable = ({ productions, setWatched }) => {
  const [watchedModalOpen, setWatchedModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [watchDate, setWatchDate] = useState(new Date());
  const [reviewText, setReviewText] = useState("");

  const [searchText, setSearchText] = useState("");
  const [assembleSeries, setAssembleSeries] = useState(false);
  const [filterWatched, setFilterWatched] = useState(false);

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

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
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

  let reunitedSeries = {};

  const isSeriesAlreadyReunited = (title, season) => {
    if (title in reunitedSeries) {
      const reunitedSeasons = reunitedSeries[title];
      if (reunitedSeasons.includes(season)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const addSeriesToReunitedOnes = (title, season) => {
    if (title in reunitedSeries) {
      const reunitedSeasons = reunitedSeries[title];
      reunitedSeasons.push(season);
      reunitedSeries[title] = reunitedSeasons;
    } else {
      const reunitedSerie = {};
      reunitedSerie[title] = [season];
      reunitedSeries = { reunitedSeries, ...reunitedSerie };
    }
  };

  let sortedProductions = [];

  if (assembleSeries) {
    productions
      .sort((a, b) => a.order - b.order)
      .forEach((production) => {
        if (production.type === "Film") {
          sortedProductions.push(production);
        } else {
          const { title, season, order } = production;
          if (!isSeriesAlreadyReunited(title, season)) {
            // Trouver tout
            const episodes = productions.filter(
              (examinedProduction) =>
                examinedProduction.title === title &&
                examinedProduction.season === season
            );

            // Former la somme / watch_date
            let totalLength = 0;
            let hasBeenTotallyWatched = true;

            episodes.forEach((ep) => {
              totalLength += ep.length;
              hasBeenTotallyWatched =
                hasBeenTotallyWatched && ep.watch_dates.length;
            });

            const watch_dates = hasBeenTotallyWatched
              ? [episodes.slice(-1).watch_dates.slice(-1)]
              : [];

            const newProduction = {
              title: `${title} (saison ${season})`,
              watch_dates,
              length: totalLength,
              order,
            };

            sortedProductions.push(newProduction);
            addSeriesToReunitedOnes(title, season);
          }
        }
      });
  } else {
    sortedProductions = productions.sort((a, b) => a.order - b.order);
  }

  // Filtrer les productions basées sur la recherche
  const filteredProductions = sortedProductions.filter((production) => {
    const titleMatch = production.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    if (filterWatched) {
      return titleMatch && production.watch_dates.length === 0;
    } else {
      return titleMatch;
    }
  });

  return (
    <React.Fragment>
      <Paper
        style={{ paddingBottom: "10px", padding: "10px", marginBottom: "10px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <TextField
            label='Search'
            value={searchText}
            onChange={handleSearchTextChange}
            style={{ marginRight: "20px" }}
          />
          <FormControlLabel
            control={
              <Switch onChange={() => setAssembleSeries(!assembleSeries)} />
            }
            label='Condense'
            style={{ marginRight: "10px", margin: "auto" }}
          />
          <FormControlLabel
            control={
              <Switch onChange={() => setFilterWatched(!filterWatched)} />
            }
            label='To watch'
          />
        </div>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Length</TableCell>
              {!assembleSeries && <TableCell>Season</TableCell>}
              {!assembleSeries && <TableCell>Episode</TableCell>}
              <TableCell>Watched</TableCell>
              <TableCell>Reviewed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductions.map((production) => (
              <TableRow key={production.id}>
                <TableCell>{production.title}</TableCell>
                <TableCell>{production.length}</TableCell>
                {!assembleSeries && (
                  <TableCell>{production.season || "-"}</TableCell>
                )}
                {!assembleSeries && (
                  <TableCell>{production.episode || "-"}</TableCell>
                )}
                <TableCell>
                  <Button
                    variant={
                      production.watch_dates.length ? "outlined" : "contained"
                    }
                    onClick={() => {
                      if (!assembleSeries) handleWatchedClick(production);
                    }}
                  >
                    {production.watch_dates.length ? "Rewatch" : "Watch"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant={production.review ? "outlined" : "contained"}
                    color='secondary'
                    onClick={() => {
                      if (!assembleSeries) handleReviewClick(production);
                    }}
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
    </React.Fragment>
  );
};

export default ProductionTable;
