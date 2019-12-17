var express = require("express");
var router = express.Router();

const tableName = "sessions";

function integerOperators(integerOperator, variable) {
  switch (integerOperator) {
    case "equals":
      return " = " + mysql.escape(variable);
    case "between":
      return " BETWEEN " + variable;
    case "greater_than":
      return " > " + mysql.escape(variable);
    case "less_than":
      return " < " + mysql.escape(variable);
    case "in_list":
      return " IN (" + variable + ")";
    default:
      return "";
  }
}

function stringOperators(stringOperator, variable) {
  switch (stringOperator) {
    case "equals":
      return " = " + mysql.escape(variable);
    case "contains":
      return " LIKE " + mysql.escape("%" + variable + "%");
    case "starts_with":
      return " LIKE " + mysql.escape(variable + "%");
    case "in_list":
      return " IN (" + variable + ")";
    default:
      return false;
  }
}

function sanitizeField(predicate) {
  const options = [
    "user_email",
    "screen_width",
    "screen_height",
    "visits",
    "user_first_name",
    "user_last_name",
    "page_response",
    "domain",
    "path"
  ];
  return options.indexOf(predicate) >= 0 ? predicate : null;
}

function findVariable(condition) {
  const variableIsString = condition.field.type !== "NUMBER";
  const variableIsNumber =
    condition.field.type === "NUMBER" &&
    condition.integerOperator.type !== "RANGE";
  const variableIsRange =
    condition.field.type === "NUMBER" &&
    condition.integerOperator.type === "RANGE";
  const variableIsList =
    condition.integerOperator.type === "LIST" ||
    condition.stringOperator.type === "LIST";

  if (variableIsString) {
    return condition.stringVariable;
  }
  if (variableIsNumber) {
    return condition.numberVariable;
  }
  if (variableIsRange) {
    return (
      mysql.escape(condition.range.first) +
      " AND " +
      mysql.escape(condition.range.last)
    );
  }
  if (variableIsList) {
    const list = condition.stringVariable.split(",");
    const sanitizedList = list.map(item => mysql.escape(item));
    return sanitizedList.join(",");
  }
}

function createSqlQuery(jsonPayload) {
  const select = `SELECT * FROM ${tableName}`;
  const conditions = jsonPayload.map(condition => {
    const field = sanitizeField(condition.field.value);
    const variable = findVariable(condition);
    const integerOperator = integerOperators(
      condition.integerOperator.value,
      variable
    );
    const stringOperator = stringOperators(
      condition.stringOperator.value,
      variable
    );
    const secondHalf = stringOperator ? stringOperator : integerOperator;
    return field + secondHalf;
  });
  const conditionStrings = conditions.length
    ? " WHERE " + conditions.join(" AND ") + ";"
    : "";
  return select + conditionStrings;
}

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "predicate-builder",
  password: "Password123",
  database: "all_sessions"
});
connection.connect();
console.log("database connected");

router.post("/", function(req, res, next) {
  console.log(createSqlQuery(req.body));

  connection.query(createSqlQuery(req.body), function(err, rows, fields) {
    if (err) throw err;

    console.log(rows.length, " rows matched");

    res.send({ queryString: createSqlQuery(req.body), matches: rows });
  });
});

// connection.end();

module.exports = router;
