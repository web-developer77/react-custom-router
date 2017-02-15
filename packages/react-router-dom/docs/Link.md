# &lt;Link>

Provides declarative, accessible navigation around your application.

```js
import { Link } from 'react-router-dom'

<Link to="/about">About</Link>
```

## to: object

The location to link to.

```js
<Link to={{
  pathname: '/courses',
  search: '?sort=name',
  hash: '#the-hash',
  state: { fromDashboard: true }
}}/>
```

## to: string

The pathname or location to link to.

```js
<Link to="/courses"/>
```

## replace: bool

When `true`, clicking the link will replace the current entry in the history stack instead of adding a new one.

```js
<Link replace to="/courses"/>
```
