export default function ErrorMessage({ message, onRetry }) {
  const safeMessage =
    typeof message === 'string' && message.trim()
      ? message
      : 'Something went wrong. Please try again.';

  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <p className="error-message__text">{safeMessage}</p>
      {typeof onRetry === 'function' ? (
        <button className="error-message__retry" onClick={onRetry} type="button">
          Try again
        </button>
      ) : null}
    </div>
  );
}
