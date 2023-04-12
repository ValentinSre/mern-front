import * as React from "react";
import {
  Button,
  ButtonGroup,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ClickAwayListener,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import { IoMdArrowDropdown } from "react-icons/io";
import CustomButtons from "../../../../shared/components/UIElements/CustomButtons";

const ColoredButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ffde59"),
  backgroundColor: "#ffde59",
  "&:hover": {
    backgroundColor: "##ad9326",
  },
}));

export default function DateButton({ options }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant='contained'
        ref={anchorRef}
        aria-label='split button'
      >
        <ColoredButton onClick={options[selectedIndex].action}>
          {options[selectedIndex].name}
        </ColoredButton>
        <ColoredButton
          size='small'
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label='select merge strategy'
          aria-haspopup='menu'
          onClick={handleToggle}
        >
          <IoMdArrowDropdown />
        </ColoredButton>
      </ButtonGroup>

      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu' autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.name}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
