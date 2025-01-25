function ResFormat(code, data, message) {
  this.code = code;
  this.data = data;
  this.message = message;
}

ResFormat.success = function (data, message) {
  return new ResFormat(0, data, message);
};

ResFormat.error = function (code, message) {
  return new ResFormat(code, null, message);
};

module.exports = ResFormat;
