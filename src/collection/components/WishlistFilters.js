import React from "react";

import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";

const WishlistFilters = ({ handleCheckboxChange }) => {
  return (
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            value="20"
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="< 20€"
      />
      <FormControlLabel
        control={
          <Checkbox
            value="50"
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="> 20€ et < 50€"
      />
      <FormControlLabel
        control={
          <Checkbox
            value="100"
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="> 50€"
      />
    </Grid>
  );
};

export default WishlistFilters;
