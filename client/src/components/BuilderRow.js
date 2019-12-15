import React, { useState } from "react";
import injectSheet from "react-jss";
import Select from "react-select";

import Colors from "../constants/Colors";
import EventOptions from "../constants/EventOptions";
import OperatorOptions from "../constants/OperatorOptions";
import ExpressionOptions from "../constants/ExpressionOptions";

import Button from "./Button";
import Tag from "./Tag";

const BuilderRow = ({ classes, removable }) => {
  const [selectedEventOption, setSelectedEventOption] = useState("");
  const [selectedOperatorOption, setSelectedOperatorOption] = useState("");
  const [selectedExpressionOption, setSelectedExpressionOption] = useState("");
  const [firstInRange, setFirstInRange] = useState("");
  const [lastInRange, setLastInRange] = useState("");
  const [numberVariable, setNumberVariable] = useState("");
  const [stringVariable, setStringVariable] = useState("");

  return (
    <div className={classes.row}>
      <Button secondary disabled={!removable} handleClick={() => {}}>
        -
      </Button>
      <Select
        className={classes.dropDown}
        value={selectedEventOption}
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
            className={classes.dropDown}
            value={selectedOperatorOption}
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
                value={firstInRange}
                onChange={e => setFirstInRange(e.target.value)}
              />
              <Tag>and</Tag>
              <input
                className={classes.numberInput}
                type="number"
                value={lastInRange}
                onChange={e => setLastInRange(e.target.value)}
              />
            </>
          ) : (
            // If the selected logical operator implies only one number, execute the following:
            <input
              disabled={selectedOperatorOption === ""}
              className={classes.numberInput}
              type="number"
              value={numberVariable}
              onChange={e => setNumberVariable(e.target.value)}
            />
          )}
        </>
      )}

      {/* If the selected event implies a non-numeric value, execute the following */}
      {selectedEventOption.type && selectedEventOption.type !== "NUMBER" && (
        <>
          <Select
            className={classes.dropDown}
            value={selectedExpressionOption}
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
            value={stringVariable}
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
