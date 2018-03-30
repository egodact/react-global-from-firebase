const arrayContainsNull = arr =>
  arr.reduce((acc, value) => !acc && value === null, false);

export default arrayContainsNull;
