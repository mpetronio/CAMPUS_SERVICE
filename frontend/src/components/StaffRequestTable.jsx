import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

export const STAFF_STATUS_LABELS = {
  submitted: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/**
 * Reusable staff-facing table of service requests.
 * Presentational only — the parent page owns fetching and passes state down.
 *
 * Props:
 *   requests  {Array|null}  list of requests, or null while loading
 *   isLoading {boolean}
 *   error     {Error|null}
 *   onRetry   {function}    re-fetch handler for the error state
 */
export default function StaffRequestTable({ requests, isLoading, error, onRetry }) {
  if (isLoading || requests === null) {
    return <LoadingSpinner label="Loading requests…" />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message || 'Failed to load service requests.'}
        onRetry={onRetry}
      />
    );
  }

  if (requests.length === 0) {
    return <p className="staff-empty">No service requests yet.</p>;
  }

  return (
    <div className="staff-table__wrapper">
      <table className="staff-table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Student</th>
            <th scope="col">Category</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">
              <span className="staff-table__sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="staff-table__title">{request.title}</td>
              <td>{request.student?.name}</td>
              <td>{request.category?.name}</td>
              <td>
                <span className={`staff-status staff-status--${request.status}`}>
                  {STAFF_STATUS_LABELS[request.status] ?? request.status}
                </span>
              </td>
              <td>{DATE_FORMATTER.format(new Date(request.createdAt))}</td>
              <td>
                <Link to={`/staff/requests/${request.id}`} className="staff-table__action">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
