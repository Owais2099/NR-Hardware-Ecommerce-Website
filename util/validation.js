function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
}

function userDetailsAreValid(
  email,
  password,
  fullname,
  phone,
  address,
  city,
  postal
) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(fullname) &&
    !isEmpty(phone) &&
    phone.trim().length <= 20 &&
    !isEmpty(address) &&
    !isEmpty(city) &&
    !isEmpty(postal) &&
    postal.trim().length === 5
  );
}

function dataEntriesMatch(value, confirmValue) {
  return value === confirmValue;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  dataEntriesMatch: dataEntriesMatch,
};
