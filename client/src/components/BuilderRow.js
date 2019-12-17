import React, { useEffect } from "react";
import injectSheet from "react-jss";
import Select from "react-select";
import produce from "immer";
import { set, has } from "lodash";

import Colors from "../constants/Colors";
import FieldOptions from "../constants/FieldOptions";
import IntegerOperators from "../constants/IntegerOperators";
import StringOperators from "../constants/StringOperators";

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
  isRowComplete,
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
          value={rowData.field}
          onChange={fieldOption => {
            updateState(initialRow);
            updateForm({
              target: {
                value: fieldOption,
                name: "field"
              }
            });
          }}
          options={FieldOptions}
          placeholder={"Select Field"}
        />

        {/* If the selected field implies a number value, execute the following: */}
        {rowData.field.type === "NUMBER" && (
          <>
            <Tag>is</Tag>
            <Select
              menuPortalTarget={document.getElementById("menu-portal")}
              styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
              className={classes.dropDown}
              value={rowData.integerOperator}
              onChange={integerOperatorOption => {
                integerOperatorOption.type !== "RANGE" &&
                  updateForm({
                    target: { value: { first: "", last: "" }, name: "range" }
                  });
                rowData.integerOperator.type === "RANGE" ||
                  (rowData.integerOperator.type === "LIST" &&
                    updateForm({
                      target: { value: "", name: "numberVariable" }
                    }));
                updateForm({
                  target: {
                    value: integerOperatorOption,
                    name: "integerOperator"
                  }
                });
              }}
              options={IntegerOperators}
              placeholder={"Select Operator"}
            />
            {/* If the selected logical operator implies a range of numbers, execute the following: */}
            {rowData.integerOperator.type === "RANGE" ? (
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
                disabled={rowData.integerOperator === ""}
                className={classes.numberInput}
                type={
                  rowData.integerOperator.type === "LIST" ? "text" : "number"
                }
                placeholder={
                  rowData.integerOperator.type === "LIST"
                    ? "1,2,3"
                    : "Enter Number"
                }
                name="numberVariable"
                value={rowData.numberVariable}
                onChange={updateForm}
              />
            )}
          </>
        )}

        {/* If the selected field implies a non-numeric value, execute the following */}
        {rowData.field.type && rowData.field.type !== "NUMBER" && (
          <>
            <Select
              menuPortalTarget={document.getElementById("menu-portal")}
              styles={{ menuPortal: styles => ({ ...styles, zIndex: 1000 }) }}
              className={classes.dropDown}
              value={rowData.stringOperator}
              onChange={stringOperatorOption =>
                updateForm({
                  target: {
                    value: stringOperatorOption,
                    name: "stringOperator"
                  }
                })
              }
              options={StringOperators}
              placeholder={"Select Operator"}
            />
            <input
              disabled={rowData.stringOperator === ""}
              className={classes.textInput}
              type="text"
              placeholder={
                rowData.stringOperator.type === "LIST"
                  ? "a,b,c"
                  : "Enter String"
              }
              name="stringVariable"
              value={rowData.stringVariable}
              onChange={updateForm}
            />
          </>
        )}
        <div className={isRowComplete ? classes.greenDot : classes.greyDot} />
      </div>
      {lastRow && (
        <div className={classes.row}>
          <Button disabled={!isRowComplete} handleClick={handleAddRow}>
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
    width: 120,
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
