import { useState } from 'react';
import { updateRequestStatus } from '../../api/requestsApi.js';
import { STAFF_STATUS_LABELS } from './StaffRequestTable.jsx';

// Contract Section 5: staff-only status transitions.
export const STATUS_TRANSITIONS = {
  submitted: ['in_progress', 'rejected'],
  in_progress: ['resolved', 'rejected'],
  resolved: [],
  rejected: [],
};

/**
 * Staff-only control for moving a request to an allowed next status.
 *
 * Props:
 *   requestId       {string}   request being updated
 *   currentStatus   {string}   current wire status (submitted/in_progress/resolved/rejected)
 *   onStatusUpdated {function} receives the updated request after the API succeeds
 */
export default function RequestStatusControl({ requestId, currentStatus, onStatusUpdated }) {
  const allowedNext = STATUS_TRANSITIONS[currentStatus] ?? [];
  const [selected, setSelected] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Terminal statuses have no allowed transitions — nothing to offer.
  if (allowedNext.length === 0) {
    return (
      <span className={`staff-status staff-status--${currentStatus}`}>
        {STAFF_STATUS_LABELS[currentStatus] ?? currentStatus}
      </span>
    );
  }

  async function handleUpdate() {
    if (!selected || isUpdating) return; // guard against duplicate submissions
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await updateRequestStatus(requestId, selected);
      setSelected('');
      onStatusUpdated?.(updated);
    } catch (err) {
      setError(err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="staff-status-control">
      <div className="staff-status-control__row">
        <label className="staff-status-control__label" htmlFor={`status-${requestId}`}>
          <span className="staff-table__sr-only">Update status</span>
        </label>
        <select
          id={`status-${requestId}`}
          className="staff-status-control__select"
          value={selected}
          disabled={isUpdating}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="" disabled>
            Select…
          </option>
          {allowedNext.map((status) => (
            <option key={status} value={status}>
              {STAFF_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="staff-status-control__button"
          disabled={!selected || isUpdating}
          onClick={handleUpdate}
        >
          {isUpdating ? 'Updating…' : 'Update'}
        </button>
      </div>
      {error && (
        <p className="staff-status-control__error" role="alert">
          {error.message || 'Status update failed. Please try again.'}
        </p>
      )}
    </div>
  );
}
