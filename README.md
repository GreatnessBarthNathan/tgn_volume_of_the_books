# The Volume of the Books

The public site is read-only. Administrators can sign in to create, edit, and
delete books, chapters, and verses. Only an authenticated administrator can
access write API endpoints; hiding controls in the browser is not the security
boundary.

## Configuration

Configure these server environment variables before starting the application:

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URL` | Yes | MongoDB connection string |
| `AUTH_SESSION_SECRET` | Yes | Random secret of at least 32 characters used to sign admin sessions |
| `ADMIN_USERNAME` | Yes | Username for the initial administrator (3-32 letters, numbers, `.`, `_` or `-`) |
| `ADMIN_PASSWORD` | Yes | Password for the initial administrator (12-128 characters) |
| `ADMIN_MASTER_RECOVERY_CODE` | No | Master code for restoring admin access; use a unique random value of at least 32 characters |
| `ADMIN_SESSION_DAYS` | No | Admin sign-in duration in days; defaults to `7`, accepts `1`-`365` |
| `PORT` | No | HTTP port; defaults to `5000` |

The initial account is created from the configured bootstrap credentials only
when there are no admin accounts. Changing the bootstrap password after account
creation does not change the stored password. After setup,
additional administrator accounts can only be created by accepting a
single-use invitation link. Signed-in administrators can issue links from
**Admin accounts**; each link expires after 24 hours. Treat invite links like
passwords and share them only with the intended recipient. There is no public
registration.

To recover an admin account, a signed-in admin can generate a single-use
recovery code from **Admin accounts** for themselves or another admin. Each
code is shown once, expires after 90 days, and replaces the previous code for
that account. The admin can use it at **Forgot username or password?** to set a
new username and password. Configure `ADMIN_MASTER_RECOVERY_CODE` with a
unique random value of at least 32 characters for operator recovery if all
admin accounts are inaccessible. Master-code recovery updates or creates only
the admin account matching the supplied username; other admins and their
sessions are not changed. Keep both types of codes private and share them only
with their intended recipient. Use HTTPS in production so credentials and
session cookies are protected in transit.

## Run locally

Copy `.env.example` to `.env`, replace the placeholder secret and password,
install the root and `front-end` dependencies, then run:

```sh
npm run dev
```

For production, build the frontend and backend, then start the server:

```sh
npm run build
npm start
```

The build command installs the frontend dependencies from its lockfile and
builds the frontend and backend. On Railway, deploy from the repository root
with `npm run build` as the build command and `npm start` as the start command.
Add the required server environment variables from the Configuration table to
the Railway service. The server serves the frontend from `front-end/dist`.
