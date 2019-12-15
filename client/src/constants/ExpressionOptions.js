const ExpressionOptions = [
  { value: "starts_with", label: "starts with", type: "STRING" },
  { value: "not_starts_with", label: "does not start with", type: "STRING" },
  { value: "equals", label: "is equal to", type: "STRING" },
  { value: "not_equal", label: "is not equal to", type: "STRING" },
  { value: "contains", label: "contains", type: "STRING" },
  { value: "not_contains", label: "does not contain", type: "STRING" },
  { value: "in_list", label: "is in list", type: "LIST" },
  { value: "not_in_list", label: "is not in list", type: "LIST" },
  { value: "contains_all", label: "contains all", type: "LIST" }
];

export default ExpressionOptions;
