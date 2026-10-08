const labels = { submitted: 'Submitted', in_progress: 'In progress', resolved: 'Resolved', rejected: 'Rejected' };

export default function RequestStatusBadge({ status }) {
  return <span className={`request-status request-status--${labels[status] ? status : 'unknown'}`}>{labels[status] || 'Unknown status'}</span>;
}
