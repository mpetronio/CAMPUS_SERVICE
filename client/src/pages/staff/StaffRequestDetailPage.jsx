import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRequestById } from '../../api/requestsApi.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import RequestStatusControl from './RequestStatusControl.jsx';
import { STAFF_STATUS_LABELS } from './status.js';
import './staff.css';

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'full',
  timeStyle: 'short',
});

export default function StaffRequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRequestById(id);
      setRequest(data);
    } catch (err) {
      setError(err);
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  // Visible status changes only after the API succeeds (STAFF-FE-03).
  const handleStatusUpdated = useCallback((updated) => {
    setRequest(updated);
  }, []);

  if (isLoading) {
    return (
      <section className="staff-page" aria-labelledby="staff-detail-heading">
        <h1 id="staff-detail-heading">Request Details</h1>
        <LoadingSpinner label="Loading request…" />
      </section>
    );
  }

  // Invalid ID (400) or missing request (404) — show a friendly not-found state.
  if (error) {
    const isNotFound = error.status === 404 || error.code === 'NOT_FOUND';
    return (
      <section className="staff-page" aria-labelledby="staff-detail-heading">
        <h1 id="staff-detail-heading">Request Details</h1>
        {isNotFound ? (
          <div className="staff-empty">
            <p>This service request could not be found.</p>
            <Link to="/staff/requests" className="staff-table__action">
              Back to all requests
            </Link>
          </div>
        ) : (
          <ErrorMessage
            message={error.message || 'Failed to load this request.'}
            onRetry={loadRequest}
          />
        )}
      </section>
    );
  }

  return (
    <section className="staff-page" aria-labelledby="staff-detail-heading">
      <header className="staff-page__header">
        <h1 id="staff-detail-heading">{request.title}</h1>
        <p className="staff-page__subtitle">
          <Link to="/staff/requests" className="staff-table__action">
            ← All requests
          </Link>
        </p>
      </header>

      <dl className="staff-detail">
        <div className="staff-detail__row">
          <dt>Status</dt>
          <dd>
            <span className={`staff-status staff-status--${request.status}`}>
              {STAFF_STATUS_LABELS[request.status] ?? request.status}
            </span>
          </dd>
        </div>
        <div className="staff-detail__row">
          <dt>Category</dt>
          <dd>{request.category?.name}</dd>
        </div>
        <div className="staff-detail__row">
          <dt>Student</dt>
          <dd>{request.student?.name}</dd>
        </div>
        <div className="staff-detail__row">
          <dt>Location</dt>
          <dd>{request.location}</dd>
        </div>
        <div className="staff-detail__row">
          <dt>Created</dt>
          <dd>{DATE_FORMATTER.format(new Date(request.createdAt))}</dd>
        </div>
        <div className="staff-detail__row">
          <dt>Last updated</dt>
          <dd>{DATE_FORMATTER.format(new Date(request.updatedAt))}</dd>
        </div>
      </dl>

      <section className="staff-detail__description" aria-labelledby="staff-description-heading">
        <h2 id="staff-description-heading">Description</h2>
        <p>{request.description}</p>
      </section>

      <section className="staff-detail__actions" aria-labelledby="staff-actions-heading">
        <h2 id="staff-actions-heading">Update Status</h2>
        <RequestStatusControl
          requestId={request.id}
          currentStatus={request.status}
          onStatusUpdated={handleStatusUpdated}
        />
      </section>
    </section>
  );
}
