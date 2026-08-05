# Auth (AuthGithub)

The GitHub OAuth callback view, mounted at the `/callback` route. It exchanges the authorization `code` returned by GitHub for an access token and stores it in a cookie.

---

## Overview

`Auth` (component name `AuthGithub`) handles the OAuth redirect step of GitHub authentication:
- Reads the `code` query parameter from the callback URL
- Dispatches the `authenticate` action with callbacks to store or remove the token
- Persists the access token in a cookie
- Redirects the user back to the home route (`/`)

---

## Props

_None_

---

## Data

| Name | Type   | Description                                        |
|------|--------|----------------------------------------------------|
| code | String | The OAuth authorization code from the query string |
| user | Object | Reserved for user information (currently unused)    |

---

## Computed Properties

_None_

---

## Lifecycle

| Hook    | Description                                                                                                   |
|---------|--------------------------------------------------------------------------------------------------------------|
| mounted | Reads `code` from `this.$route.query`, dispatches `authenticate`, sets/removes the token cookie, and redirects to `/`. |

---

## Store Integration

| Action        | Purpose                                                                                     |
|---------------|---------------------------------------------------------------------------------------------|
| authenticate  | Exchanges the OAuth `code` for a token. Receives `store` and `remove` callbacks for the cookie. |

The token cookie is keyed by `GH_ACCESS_TOKEN` and is set with a `1d` expiry, path `/`, and `lax` same-site policy.

---

## Example

```vue
<!-- Rendered automatically for the /callback route -->
<Auth />
```
