import React, { useState } from "react";
import injectSheet from "react-jss";
import useForceUpdate from "use-force-update";
import { findLastIndex } from "lodash";

import Colors from "../constants/Colors";

import Button from "./Button";
import BuilderRow from "./BuilderRow";

const initialRow = {
  field: "",
  stringOperator: "",
  integerOperator: "",
  range: { first: "", last: "" },
  stringVariable: "",
  numberVariable: ""
};

const isRowComplete = row => {
  const variableIsNumber = row.field.type && row.field.type === "NUMBER";
  const variableIsString = !variableIsNumber;
  const variableIsRange =
    variableIsNumber &&
    row.integerOperator.type &&
    row.integerOperator.type === "RANGE";
  const variableSelected =
    (variableIsNumber && row.numberVariable !== "") ||
    (variableIsString && row.stringVariable !== "") ||
    (variableIsRange && row.range.first !== "" && row.range.last !== "");
  return variableSelected;
};

const PredicateBuilder = ({ classes }) => {
  const [apiResponse, setApiResponse] = useState("");
  const [allRows, setAllRows] = useState([initialRow]);
  const completeRows = allRows.filter(row => isRowComplete(row));

  const makeServerRequest = () => {
    fetch(`http://localhost:9000/database`, {
      method: "POST",
      body: JSON.stringify(completeRows),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.text())
      .then(res => setApiResponse(JSON.parse(res)));
  };

  const forceUpdate = useForceUpdate();

  const handleRowUpdate = ({
    rowIndex,
    field,
    stringOperator,
    integerOperator,
    range,
    stringVariable,
    numberVariable
  }) => {
    const newRow = {
      field: field,
      stringOperator: stringOperator,
      integerOperator: integerOperator,
      range: range,
      stringVariable: stringVariable,
      numberVariable: numberVariable
    };

    setAllRows(prevState => {
      if (JSON.stringify(prevState[rowIndex]) !== JSON.stringify(newRow)) {
        prevState[rowIndex] = newRow;
      }
      return prevState;
    });
    forceUpdate();
  };

  const handleAddRow = () => {
    setAllRows(prevState => [...(prevState && prevState), initialRow]);
  };

  const handleRemoveRow = index => {
    setAllRows(prevState => {
      prevState && prevState.splice(index, 1);
      return prevState;
    });
    forceUpdate();
  };

  return (
    <>
      <div className={classes.contentContainer}>
        <div className={classes.header}>Search for sessions</div>

        <div className={classes.column}>
          {allRows &&
            allRows.length &&
            allRows.map((row, i) => {
              return (
                <BuilderRow
                  key={`builder-row-${i}`}
                  initialRow={initialRow}
                  handleRowUpdate={handleRowUpdate}
                  handleRemoveRow={handleRemoveRow}
                  handleAddRow={handleAddRow}
                  rowData={row}
                  rowIndex={i}
                  isRowComplete={isRowComplete(row)}
                  lastRow={i === findLastIndex(allRows)}
                />
              );
            })}
        </div>

        <p>
          <b>{apiResponse.queryString && apiResponse.queryString}</b>
        </p>

        {/* <p>
          {apiResponse.matches && apiResponse.matches.length + " Result(s)"}
        </p> */}

        <Button wide handleClick={makeServerRequest}>
          Search
        </Button>
      </div>
    </>
  );
};

const styles = {
  contentContainer: {
    background: Colors.background,
    minWidth: 900,
    minHeight: 500,
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
