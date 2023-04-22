export const formatResponseError = (errors ,status, message) => ({
  errors,
  message: {
    status,
    message
  }
});

export const formatResponseSuccess = (data, status, message) => ({
  data,
  message: {
    status,
    message
  }
});
