export function getApiErrorMessage(error, fallbackMessage = 'Ocurrio un error inesperado') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}

