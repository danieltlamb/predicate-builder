import React from "react";
import injectSheet from "react-jss";
import Colors from "../constants/Colors";

const Button = ({ children, handleClick, secondary, disabled, classes }) => {
  return (
    <button
      className={secondary ? classes.buttonSecondary : classes.buttonPrimary}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const buttons = {
  padding: 10,
  fontSize: 12,
  transition: "200ms",
  display: "inline-block",
  margin: [0, 5],
  borderRadius: 4
};

const disabled = {
  pointerEvents: "none",
  opacity: 0.3,
  filter: "grayscale(1)"
};

const styles = {
  buttonPrimary: props => ({
    background: Colors.primaryBlue,
    color: Colors.white,
    border: "none",
    ...buttons,
    ...(props.disabled ? disabled : null),
    "&:hover": {
      background: Colors.secondaryBlue
    }
  }),
  buttonSecondary: props => ({
    background: Colors.white,
    color: Colors.textGrey,
    border: [1, "solid", Colors.borderGrey],
    ...buttons,
    ...(props.disabled ? disabled : null),
    "&:hover": {
      border: [1, "solid", Colors.primaryBlue],
      color: Colors.primaryBlue
    }
  })
};

export default injectSheet(styles)(Button);
