import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";

const ThemedRadioButton = withStyles({
  root: {
    color: "#ffde59",
    "&$checked": {
      color: "#ffde59",
    },
  },
  checked: {},
})((props) => <Radio color='default' {...props} />);

export default ThemedRadioButton;
