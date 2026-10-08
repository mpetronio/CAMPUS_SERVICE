import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getRequests } from '../../api/requestsApi.js';
import RequestStatusBadge from './RequestStatusBadge.jsx';
import requestError from './requestError.js';
import './student.css';

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const location = useLocation();
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getRequests().then((data) => { if (active) setRequests(data); })
      .catch((err) => { if (active) setError(requestError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  return <section className="student-page" aria-labelledby="requests-title">
    <div className="student-heading"><h1 id="requests-title">My requests</h1><Link className="student-action" to="/student/requests/new">New request</Link></div>
    <p>Track your campus service requests and their progress.</p>
    {location.state?.requestCreated && <p role="status">Your request was submitted successfully.</p>}
    {loading ? <p role="status">Loading your requests…</p> : error ? <div className="student-error" role="alert"><p>{error}</p><Link to="/login">Sign in</Link> <button onClick={() => setAttempt(attempt + 1)}>Try again</button></div> : requests.length === 0 ? <p>You have no requests yet. Use New request to report a campus concern.</p> :
      <ul className="request-list">{requests.map((request) => <li className="request-card" key={request.id}>
        <div className="student-heading"><h2>{request.title}</h2><RequestStatusBadge status={request.status} /></div>
        <dl><dt>Category</dt><dd>{request.category?.name || 'Unavailable category'}</dd><dt>Location</dt><dd>{request.location}</dd><dt>Submitted</dt><dd><time dateTime={request.createdAt}>{new Date(request.createdAt).toLocaleString()}</time></dd></dl>
        <p>{request.description}</p>
      </li>)}</ul>}
  </section>;
}
