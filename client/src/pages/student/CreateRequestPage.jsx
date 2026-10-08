import { useAuth } from '../../context/AuthContext.jsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../../api/categoriesApi.js';
import { createRequest } from '../../api/requestsApi.js';
import requestError from './requestError.js';
import './student.css';

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const submitting = useRef(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const { logout } = useAuth();
  const [errorStatus, setErrorStatus] = useState(null);
  const [error, setError] = useState('');
  const [details, setDetails] = useState([]);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [fields, setFields] = useState({ categoryId: '', title: '', description: '', location: '' });
  useEffect(() => {
    let active = true;
    setLoading(true);
    setCategoryError('');
    getCategories().then((data) => { if (active) setCategories(data); })
      .catch((err) => { if (active) setCategoryError(requestError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  function change(event) { setFields({ ...fields, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const payload = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.trim()]));
    const limits = { title: [5, 120], description: [10, 2000], location: [2, 150] };
    const invalid = Object.entries(limits).filter(([key, [min, max]]) => payload[key].length < min || payload[key].length > max)
      .map(([field, [min, max]]) => ({ field, message: `${field} must contain ${min}–${max} characters.` }));
    if (!categories.some((category) => category.id === payload.categoryId)) invalid.push({ field: 'categoryId', message: 'Choose an available category.' });
    setDetails(invalid);
    setError('');
    if (invalid.length) { setError('Please correct the form below.'); return; }
    submitting.current = true;
    setSaving(true);
    try {
      await createRequest(payload);
      navigate('/student/requests', { replace: true, state: { requestCreated: true } });
    } catch (err) {
      setErrorStatus(err.status);
      setError(requestError(err));
      setDetails(Array.isArray(err.details) ? err.details : []);
    } finally { submitting.current = false; setSaving(false); }
  }
  return <section className="student-page" aria-labelledby="create-title">
    <Link to="/student/requests">Back to my requests</Link><h1 id="create-title">New service request</h1>
    <p>Describe your concern and where campus staff can find it.</p>
    {loading && <p role="status">Loading categories…</p>}
    {categoryError && <div className="student-error" role="alert"><p>{categoryError}</p><button onClick={() => setAttempt(attempt + 1)}>Retry categories</button></div>}
    {!loading && !categoryError && !categories.length && <p role="status">No service categories are available. Please try again later.</p>}
    {error && <div className="student-error" role="alert"><p>{error}</p>{details.length > 0 && <ul>{details.map((detail, index) => <li key={index}>{detail.message}</li>)}</ul>}{errorStatus === 401 && <button type="button" onClick={() => { logout(); navigate("/login"); }}>Sign in again</button>}</div>}
    <form className="student-form" onSubmit={submit} aria-busy={saving}>
      <fieldset disabled={saving}><legend>Request details</legend>
        <label htmlFor="categoryId">Category</label><select id="categoryId" name="categoryId" required value={fields.categoryId} onChange={change} disabled={loading || Boolean(categoryError) || !categories.length}><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
        <label htmlFor="title">Title</label><input id="title" name="title" required minLength={5} maxLength={120} value={fields.title} onChange={change} />
        <label htmlFor="location">Location</label><input id="location" name="location" required minLength={2} maxLength={150} value={fields.location} onChange={change} placeholder="Building and room number" />
        <label htmlFor="description">Description</label><textarea id="description" name="description" required minLength={10} maxLength={2000} value={fields.description} onChange={change} />
        <button type="submit" disabled={loading || Boolean(categoryError) || !categories.length}>{saving ? 'Submitting…' : 'Submit request'}</button>
      </fieldset>
    </form>
  </section>;
}
