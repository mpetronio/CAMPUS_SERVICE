export default function requestError(error) {
  if (error.status === 401) return 'Your session has expired. Sign in again to continue.';
  if (error.status === 403) return 'You do not have permission to perform this action.';
  if (error.status === 404) return 'The requested service could not be found.';
  if (error.status >= 500) return 'The service is temporarily unavailable. Please try again.';
  if (!error.status) return 'Unable to connect. Check your connection and try again.';
  return error.message || 'Unable to complete the request. Please try again.';
}
