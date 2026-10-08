import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRequests } from '../../api/requestsApi.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const STATUS_LABELS = {
  submitted: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function StaffDashboardPage() {
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(null);

  const loadRequests = useCallback(async () => {
    setError(null);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const overview = useMemo(() => {
    if (!Array.isArray(requests)) return null;
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === 'submitted').length,
      inProgress: requests.filter((r) => r.status === 'in_progress').length,
      resolved: requests.filter((r) => r.status === 'resolved').length,
    };
  }, [requests]);

  if (error) {
    return (
      <section className="staff-page" aria-labelledby="staff-dashboard-heading">
        <h1 id="staff-dashboard-heading">Staff Dashboard</h1>
        <ErrorMessage
          message={error.message || 'Failed to load service requests.'}
          onRetry={loadRequests}
        />
      </section>
    );
  }

  if (!requests) {
    return (
      <section className="staff-page" aria-labelledby="staff-dashboard-heading">
        <h1 id="staff-dashboard-heading">Staff Dashboard</h1>
        <LoadingSpinner label="Loading requests…" />
      </section>
    );
  }

  const recent = requests.slice(0, 5);

  return (
    <section className="staff-page" aria-labelledby="staff-dashboard-heading">
      <header className="staff-page__header">
        <h1 id="staff-dashboard-heading">Staff Dashboard</h1>
        <p className="staff-page__subtitle">
          Overview of all campus service requests.
        </p>
      </header>

      <div className="staff-overview" role="list" aria-label="Request overview">
        <div className="staff-overview__card" role="listitem">
          <span className="staff-overview__value">{overview.total}</span>
          <span className="staff-overview__label">Total Requests</span>
        </div>
        <div className="staff-overview__card staff-overview__card--pending" role="listitem">
          <span className="staff-overview__value">{overview.pending}</span>
          <span className="staff-overview__label">Pending</span>
        </div>
        <div className="staff-overview__card staff-overview__card--in-progress" role="listitem">
          <span className="staff-overview__value">{overview.inProgress}</span>
          <span className="staff-overview__label">In Progress</span>
        </div>
        <div className="staff-overview__card staff-overview__card--resolved" role="listitem">
          <span className="staff-overview__value">{overview.resolved}</span>
          <span className="staff-overview__label">Resolved</span>
        </div>
      </div>

      <section aria-labelledby="staff-recent-heading">
        <div className="staff-section__header">
          <h2 id="staff-recent-heading">Recent Requests</h2>
        </div>

        {requests.length === 0 ? (
          <p className="staff-empty">No service requests yet.</p>
        ) : (
          <ul className="staff-recent">
            {recent.map((request) => (
              <li key={request.id} className="staff-recent__item">
                <div className="staff-recent__main">
                  <Link to={`/staff/requests/${request.id}`} className="staff-recent__title">
                    {request.title}
                  </Link>
                  <span className="staff-recent__meta">
                    {request.student?.name} · {request.category?.name} ·{' '}
                    {DATE_FORMATTER.format(new Date(request.createdAt))}
                  </span>
                </div>
                <span className={`staff-status staff-status--${request.status}`}>
                  {STATUS_LABELS[request.status] ?? request.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
