import React, { useEffect } from "react";
import injectSheet from "react-jss";
import Select from "react-select";
import produce from "immer";
import { set, has } from "lodash";

import Colors from "../constants/Colors";
import EventOptions from "../constants/EventOptions";
import OperatorOptions from "../constants/OperatorOptions";
import ExpressionOptions from "../constants/ExpressionOptions";

import Button from "./Button";
import Tag from "./Tag";

// Reducer code adapted from: https://levelup.gitconnected.com/handling-complex-form-state-using-react-hooks-76ee7bc937
function reducer(state, updateArg) {
  if (updateArg.constructor === Function) {
    return { ...state, ...updateArg(state) };
  }
  if (updateArg.constructor === Object) {
    if (has(updateArg, "_path") && has(updateArg, "_value")) {
      const { _path, _value } = updateArg;
      return produce(state, draft => {
        set(draft, _path, _value);
      });
    } else {
      return { ...state, ...updateArg };
    }
  }
}

const BuilderRow = ({
  classes,
  initialRow,
  handleRowUpdate,
  handleRemoveRow,
  handleAddRow,
  rowData,
  rowIndex,
  lastRow
}) => {
  const [state, updateState] = React.useReducer(reducer, initialRow);
  const updateForm = React.useCallback(({ target: { value, name } }) => {
    const updatePath = name.split(".");
    if (updatePath.length === 1) {
      const [key] = updatePath;

      updateState({
        [key]: value
      });
    }

    if (updatePath.length === 2) {
      updateState({
        _path: updatePath,
        _value: value
      });
    }
  }, []);

  useEffect(() => {
    handleRowUpdate({ rowIndex: rowIndex, ...state });
  }, [state]);

  const variableIsNumber =
    rowData.event.type && rowData.event.type === "NUMBER";
  const variableIsString = !variableIsNumber;
  const variableIsRange =
    variableIsNumber &&
    rowData.operator.type &&
    rowData.operator.type === "RANGE";
  const variableSelected =
    (variableIsNumber && rowData.numberVariable !== "") ||
    (variableIsString && rowData.stringVariable !== "") ||
    (variableIsRange &&
      rowData.range.first !== "" &&
      rowData.range.last !== "");

  return (
    <>
      <div className={classes.row}>
        <Button
          secondary
          disabled={lastRow && rowIndex === 0}
          handleClick={() => {
            handleRemoveRow(rowIndex);
          }}
        >
          -
        </Button>
        <Select
          menuPortalTarget={document.getElementById("menu-portal")}
          styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
          className={classes.dropDown}
          value={rowData.event}
          onChange={eventOption => {
            updateState(initialRow);
            updateForm({
              target: {
                value: eventOption,
                name: "event"
              }
            });
          }}
          options={EventOptions}
          placeholder={"Select Event"}
        />

        {/* If the selected event implies a number value, execute the following: */}
        {rowData.event.type === "NUMBER" && (
          <>
            <Tag>is</Tag>
            <Select
              menuPortalTarget={document.getElementById("menu-portal")}
              styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
              className={classes.dropDown}
              value={rowData.operator}
              onChange={operatorOption => {
                operatorOption.type !== "RANGE" &&
                  updateForm({
                    target: { value: { first: "", last: "" }, name: "range" }
                  });
                rowData.operator.type === "RANGE" &&
                  updateForm({
                    target: { value: "", name: "numberVariable" }
                  });
                updateForm({
                  target: { value: operatorOption, name: "operator" }
                });
              }}
              options={OperatorOptions}
              placeholder={"Select Operator"}
            />
            {/* If the selected logical operator implies a range of numbers, execute the following: */}
            {rowData.operator.type === "RANGE" ? (
              <>
                <input
                  className={classes.numberInput}
                  type="number"
                  name="range.first"
                  value={rowData.range.first}
                  onChange={updateForm}
                />
                <Tag>and</Tag>
                <input
                  className={classes.numberInput}
                  type="number"
                  name="range.last"
                  value={rowData.range.last}
                  onChange={updateForm}
                />
              </>
            ) : (
              // If the selected logical operator implies only one number, execute the following:
              <input
                disabled={rowData.operator === ""}
                className={classes.numberInput}
                type="number"
                name="numberVariable"
                value={rowData.numberVariable}
                onChange={updateForm}
              />
            )}
          </>
        )}

        {/* If the selected event implies a non-numeric value, execute the following */}
        {rowData.event.type && rowData.event.type !== "NUMBER" && (
          <>
            <Select
              menuPortalTarget={document.getElementById("menu-portal")}
              styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
              className={classes.dropDown}
              value={rowData.expression}
              onChange={expressionOption =>
                updateForm({
                  target: { value: expressionOption, name: "expression" }
                })
              }
              options={ExpressionOptions}
              placeholder={"Select Expression"}
            />
            <input
              disabled={rowData.expression === ""}
              className={classes.textInput}
              type="text"
              name="stringVariable"
              value={rowData.stringVariable}
              onChange={updateForm}
            />
          </>
        )}
        <div
          className={variableSelected ? classes.greenDot : classes.greyDot}
        />
      </div>
      {lastRow && (
        <div className={classes.row}>
          <Button disabled={!variableSelected} handleClick={handleAddRow}>
            AND
          </Button>
        </div>
      )}
    </>
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

const dot = {
  width: 10,
  height: 10,
  display: "inline-block",
  borderRadius: 5,
  marginLeft: 8
};

const styles = {
  row: {
    padding: 10,
    minWidth: 900
  },
  dropDown: {
    margin: [0, 5],
    display: "inline-block",
    width: 200,
    transform: "translate(0px, 1px)"
  },
  numberInput: {
    width: 100,
    ...input
  },
  textInput: {
    width: 200,
    ...input
  },
  greyDot: {
    background: Colors.borderGrey,
    ...dot
  },
  greenDot: {
    background: Colors.green,
    ...dot
  }
};

export default injectSheet(styles)(BuilderRow);
