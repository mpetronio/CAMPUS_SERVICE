const supportedSizes = new Set(['small', 'medium', 'large']);

/**
 * Accessible shared loading feedback.
 *
 * @param {{ label?: string, size?: 'small' | 'medium' | 'large' }} props
 */
export default function LoadingSpinner({ label = 'Loading…', size = 'medium' }) {
  const normalizedSize = supportedSizes.has(size) ? size : 'medium';

  return (
    <span
      className={`loading-spinner loading-spinner--${normalizedSize}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading-spinner__indicator" aria-hidden="true" />
      <span className="loading-spinner__label">{label}</span>
    </span>
  );
}
