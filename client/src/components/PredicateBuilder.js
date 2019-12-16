import React, { useState, useEffect } from "react";
import injectSheet from "react-jss";

import Colors from "../constants/Colors";
import Button from "./Button";
import Tag from "./Tag";
import BuilderRow from "./BuilderRow";

const initialRow = {
  event: "", //{ value: "", label: "", type: "" },
  expression: "", //{ value: "", label: "", type: "" },
  operator: "", //{ value: "", label: "", type: "" },
  range: { first: "", last: "" },
  stringVariable: "",
  numberVariable: ""
};

const PredicateBuilder = ({ classes }) => {
  const [queryRequest, setQueryRequest] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [allRows, setAllRows] = useState([initialRow]);

  const callAPI = () => {
    fetch(`http://localhost:9000/database?request=${queryRequest}`)
      .then(res => res.text())
      .then(res => setApiResponse(res));
  };

  useEffect(() => {
    callAPI();
  });

  const handleRowComplete = ({
    rowIndex,
    event,
    expression,
    operator,
    range,
    stringVariable,
    numberVariable
  }) => {
    const newRow = {
      event: event,
      expression: expression,
      operator: operator,
      range: range,
      stringVariable: stringVariable,
      numberVariable: numberVariable
    };

    // prevState.splice(rowIndex, 1, newRow);

    setAllRows(prevState => {
      if (JSON.stringify(prevState[rowIndex]) !== JSON.stringify(newRow)) {
        prevState[rowIndex] = newRow;
      }
      return prevState;
    });
    console.log("Update Rows", allRows);
  };

  const handleAddRow = () => {
    setAllRows(prevState => [...(prevState && prevState), initialRow]);
  };

  const handleRemoveRow = i => {
    setAllRows(prevState => {
      prevState && prevState.splice(i, 1);
      return prevState;
    });

    console.log("Update Rows", allRows);
  };

  return (
    <>
      <div className={classes.contentContainer}>
        <div className={classes.header}>Search for sessions</div>

        <div className={classes.column}>
          {allRows &&
            allRows.length &&
            allRows.map((row, i) => (
              <BuilderRow
                key={`builder-row-${i}`}
                removable={true}
                handleRowComplete={handleRowComplete}
                handleRemoveRow={handleRemoveRow}
                rowData={row}
                rowIndex={i}
              />
            ))}
        </div>

        <p className="App-intro">{apiResponse}</p>

        {/* Various Components below */}

        <Button handleClick={() => setQueryRequest("SELECT ALL WHERE 1 = 1")}>
          Click to set Query Request
        </Button>
        <Tag>is</Tag>
        <Button secondary handleClick={handleAddRow}>
          Add Row
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
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  }
};

export default injectSheet(styles)(PredicateBuilder);
