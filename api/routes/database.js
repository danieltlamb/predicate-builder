var express = require("express");
var router = express.Router();

const databaseName = "'all_sessions'";

function integerOperators(integerOperator, variable) {
  switch (integerOperator) {
    case "range":
      return " BETWEEN " + variable;
    case "less_or_equal":
      return " <= " + mysql.escape(variable);
    case "equals":
      return " = " + mysql.escape(variable);
    case "not_equal":
      return " != " + mysql.escape(variable);
    case "greater_or_equal":
      return " >= " + mysql.escape(variable);
    default:
      return "";
  }
}

function stringOperators(stringOperator, variable) {
  switch (stringOperator) {
    case "starts_with":
      return " LIKE " + mysql.escape(variable + "%");
    case "not_starts_with":
      return " NOT LIKE " + mysql.escape(variable + "%");
    case "equals":
      return " = " + mysql.escape(variable);
    case "not_equal":
      return " != " + mysql.escape(variable);
    case "contains":
      return " LIKE " + mysql.escape("%" + variable + "%");
    case "not_contains":
      return " NOT LIKE " + mysql.escape("%" + variable + "%");
    case "in_list":
      return " IN (" + variable + ")";
    case "not_in_list":
      return " NOT IN (" + variable + ")";
    default:
      return false;
  }
}

function findVariable(condition) {
  const variableIsString = condition.predicate.type !== "NUMBER";
  const variableIsNumber =
    condition.predicate.type === "NUMBER" &&
    condition.integerOperator.type !== "RANGE";
  const variableIsRange =
    condition.predicate.type === "NUMBER" &&
    condition.integerOperator.type === "RANGE";
  const variableIsList =
    condition.predicate.type !== "NUMBER" &&
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
  const select = `SELECT * FROM ${databaseName} WHERE `;
  const conditions = jsonPayload.map(condition => {
    const field = mysql.escape(condition.predicate.value);
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
  const conditionStrings = conditions.join(" AND ");
  return select + conditionStrings + ";";
}

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "sessionsapp",
  password: "Password123"
  // database: databaseName
});

connection.connect();

// connection.query("SELECT 1 + 1 AS solution", function(err, rows, fields) {
//   if (err) throw err;

//   console.log("The solution is: ", rows[0].solution);
// });

console.log("database connected");

router.post("/", function(req, res, next) {
  console.log(createSqlQuery(req.body));
  res.send(createSqlQuery(req.body));
});

connection.end();

module.exports = router;
