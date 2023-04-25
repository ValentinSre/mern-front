import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

const ThemedCheckbox = withStyles({
  root: {
    color: "#ffde59",
    "&$checked": {
      color: "#ffde59",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default ThemedCheckbox;
