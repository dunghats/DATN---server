export const formatResponseError = (errors) => ({
  errors,
  message: {
    status: 'error'
  }
});

export const formatResponseSuccess = (data) => ({
  data,
  message: {
    status: 'success'
  }
});
