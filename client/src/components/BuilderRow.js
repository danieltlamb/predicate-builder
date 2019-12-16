import React, { useState, useEffect } from "react";
import injectSheet from "react-jss";
import Select from "react-select";

import Colors from "../constants/Colors";
import EventOptions from "../constants/EventOptions";
import OperatorOptions from "../constants/OperatorOptions";
import ExpressionOptions from "../constants/ExpressionOptions";

import Button from "./Button";
import Tag from "./Tag";

const BuilderRow = ({
  classes,
  removable,
  handleRowComplete,
  handleRemoveRow,
  rowData,
  rowIndex
}) => {
  const [selectedEventOption, setSelectedEventOption] = useState("");
  const [selectedOperatorOption, setSelectedOperatorOption] = useState("");
  const [selectedExpressionOption, setSelectedExpressionOption] = useState("");
  const [firstInRange, setFirstInRange] = useState("");
  const [lastInRange, setLastInRange] = useState("");
  const [numberVariable, setNumberVariable] = useState("");
  const [stringVariable, setStringVariable] = useState("");

  const variableIsString =
    selectedEventOption.type && selectedEventOption.type !== "NUMBER";
  const variableIsNumber =
    selectedEventOption.type && selectedEventOption.type === "NUMBER";
  const variableIsRange =
    variableIsNumber &&
    selectedOperatorOption.type &&
    selectedOperatorOption.type === "RANGE";
  const variableSelected =
    (variableIsNumber && numberVariable !== "") ||
    (variableIsString && stringVariable !== "") ||
    (variableIsRange && firstInRange !== "" && lastInRange !== "");

  const newRowData = {
    rowIndex: rowIndex,
    event: selectedEventOption,
    expression: selectedExpressionOption,
    operator: selectedOperatorOption,
    range: { first: firstInRange, last: lastInRange },
    stringVariable: stringVariable,
    numberVariable: numberVariable
  };

  useEffect(() => {
    handleRowComplete(newRowData);
  }, [
    variableSelected &&
      rowData &&
      JSON.stringify(rowData) !== JSON.stringify(newRowData)
  ]);

  return (
    <div className={classes.row}>
      <Button
        secondary
        disabled={!removable}
        handleClick={() => handleRemoveRow(rowIndex)}
      >
        -
      </Button>
      <Select
        menuPortalTarget={document.getElementById("menu-portal")}
        styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
        className={classes.dropDown}
        value={
          rowData && rowData.event !== "" ? rowData.event : selectedEventOption
        }
        onChange={selectedEventOption =>
          setSelectedEventOption(selectedEventOption)
        }
        options={EventOptions}
        isDisabled={removable && selectedEventOption !== ""}
        placeholder={"Select Event"}
      />

      {/* If the selected event implies a number value, execute the following: */}
      {selectedEventOption.type && selectedEventOption.type === "NUMBER" && (
        <>
          <Tag>is</Tag>
          <Select
            menuPortalTarget={document.getElementById("menu-portal")}
            styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
            className={classes.dropDown}
            value={
              rowData && rowData.operator !== ""
                ? rowData.operator
                : selectedOperatorOption
            }
            onChange={selectedOperatorOption =>
              setSelectedOperatorOption(selectedOperatorOption)
            }
            options={OperatorOptions}
            isDisabled={removable && selectedOperatorOption !== ""}
            placeholder={"Select Operator"}
          />
          {/* If the selected logical operator implies a range of numbers, execute the following: */}
          {selectedOperatorOption.type &&
          selectedOperatorOption.type === "RANGE" ? (
            <>
              <input
                className={classes.numberInput}
                type="number"
                value={
                  rowData && rowData.range && rowData.range.first !== ""
                    ? rowData.range.first
                    : firstInRange
                }
                onChange={e => setFirstInRange(e.target.value)}
              />
              <Tag>and</Tag>
              <input
                className={classes.numberInput}
                type="number"
                value={
                  rowData && rowData.range && rowData.range.last !== ""
                    ? rowData.range.last
                    : lastInRange
                }
                onChange={e => setLastInRange(e.target.value)}
              />
            </>
          ) : (
            // If the selected logical operator implies only one number, execute the following:
            <input
              disabled={selectedOperatorOption === ""}
              className={classes.numberInput}
              type="number"
              value={
                rowData && rowData.numberVariable !== ""
                  ? rowData.numberVariable
                  : numberVariable
              }
              onChange={e => {
                setNumberVariable(e.target.value);
              }}
            />
          )}
        </>
      )}

      {/* If the selected event implies a non-numeric value, execute the following */}
      {selectedEventOption.type && selectedEventOption.type !== "NUMBER" && (
        <>
          <Select
            menuPortalTarget={document.getElementById("menu-portal")}
            styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
            className={classes.dropDown}
            value={
              rowData && rowData.expression !== ""
                ? rowData.expression
                : selectedExpressionOption
            }
            onChange={selectedExpressionOption =>
              setSelectedExpressionOption(selectedExpressionOption)
            }
            options={ExpressionOptions}
            isDisabled={removable && selectedExpressionOption !== ""}
            placeholder={"Select Expression"}
          />
          <input
            disabled={selectedExpressionOption === ""}
            className={classes.textInput}
            type="text"
            value={
              rowData && rowData.stringVariable !== ""
                ? rowData.stringVariable
                : stringVariable
            }
            onChange={e => setStringVariable(e.target.value)}
          />
        </>
      )}
    </div>
  );
};

const input = {
  display: "inline-block",
  height: 24,
  fontSize: 14,
  padding: 5,
  margin: [0, 5],
  borderRadius: 4,
  border: ["1px", "solid", Colors.borderGrey],
  transform: "translate(0px, 1px)"
};

const styles = {
  row: {
    padding: 10
  },
  dropDown: {
    margin: [0, 5],
    display: "inline-block",
    width: 200,
    transform: "translate(0px, 1px)"
  },
  numberInput: {
    width: 70,
    ...input
  },
  textInput: {
    width: 200,
    ...input
  }
};

export default injectSheet(styles)(BuilderRow);
