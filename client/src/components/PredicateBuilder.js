import React, { useState, useEffect } from "react";
import injectSheet from "react-jss";
import Colors from "../constants/Colors";
import Button from "./Button";
import Tag from "./Tag";
import BuilderRow from "./BuilderRow";

const PredicateBuilder = ({ classes }) => {
  const [queryRequest, setQueryRequest] = useState("");
  const [apiResponse, setApiResponse] = useState("");

  const callAPI = () => {
    fetch(`http://localhost:9000/database?request=${queryRequest}`)
      .then(res => res.text())
      .then(res => setApiResponse(res));
  };

  useEffect(() => {
    callAPI();
  });

  return (
    <>
      <div className={classes.contentContainer}>
        <div className={classes.header}>Search for sessions</div>

        <div className={classes.column}>
          <BuilderRow removable={false} />
        </div>

        <p className="App-intro">{apiResponse}</p>

        {/* Various Components below */}

        <Button handleClick={() => setQueryRequest("SELECT ALL WHERE 1 = 1")}>
          Click to set Query Request
        </Button>
        <Tag>is</Tag>
        <Button
          secondary
          handleClick={() => setQueryRequest("SELECT ALL WHERE 1 = 1")}
        >
          Request
        </Button>
      </div>
    </>
  );
};

const styles = {
  contentContainer: {
    background: Colors.background,
    width: "80%",
    minHeight: 800,
    padding: [0, 12],
    borderRadius: 4
  },
  header: {
    textTransform: "uppercase",
    fontSize: 18,
    textAlign: "left",
    borderBottom: [1, "solid", Colors.borderGrey],
    padding: [12, 0]
  },
  column: {
    display: "flex"
  }
};

export default injectSheet(styles)(PredicateBuilder);
