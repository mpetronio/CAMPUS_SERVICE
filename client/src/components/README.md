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
