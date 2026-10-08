# Shared frontend components

## LoadingSpinner

Import the default export and provide a short label that describes the work in progress:

```jsx
import LoadingSpinner from '../components/LoadingSpinner.jsx';

<LoadingSpinner label="Loading requests…" />;
```

The optional `size` prop accepts `small`, `medium`, or `large`. Use `small` inside compact controls and the default `medium` for page-level loading feedback:

```jsx
<LoadingSpinner label="Saving request…" size="small" />;
```

The component already exposes an accessible live status. Do not add a second `role="status"` around it.

## ErrorMessage

Pass only a concise, user-safe message. API errors from `apiFetch` already expose a normalized message:

```jsx
import ErrorMessage from '../components/ErrorMessage.jsx';

<ErrorMessage message={error.message} />;
```

Provide `onRetry` when the failed action can be attempted again. The component adds the retry button automatically:

```jsx
<ErrorMessage message="Unable to load requests." onRetry={loadRequests} />;
```

Do not pass error objects, stack traces, response bodies, tokens, or diagnostic details as `message`.
