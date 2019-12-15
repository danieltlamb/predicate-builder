import React from "react";
import injectSheet from "react-jss";
import Colors from "../constants/Colors";

const Tag = ({ children, classes }) => {
  return <div className={classes.tag}>{children}</div>;
};

const styles = {
  tag: {
    margin: [0, 5],
    padding: 10,
    fontSize: 12,
    background: Colors.secondaryBackground,
    display: "inline-block",
    borderRadius: 4
  }
};

export default injectSheet(styles)(Tag);
