function formatResponse(code, message, data) {
  return {
    code,
    message,
    data,
  };
}

formatResponse.success = (data) => formatResponse(0, 'Success', data);
formatResponse.error = (message) => formatResponse(1, message, null);

module.exports = formatResponse;
