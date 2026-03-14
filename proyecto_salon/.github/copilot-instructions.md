# Project Guidelines

## Scope
- This workspace is a monorepo with:
- `salon_frontend` (React + Vite)
- `salon_managment` (Flask + SQLAlchemy)
- Prefer small, focused changes and keep feature boundaries intact.

## Build and Test
- Frontend setup and run:
```bash
cd salon_frontend
npm install
npm run dev
```
- Frontend quality/build commands:
```bash
cd salon_frontend
npm run lint
npm run build
npm run preview
```
- Backend setup and run:
```bash
cd salon_managment
python -m venv venv
# Windows
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
- Migrations (when schema changes):
```bash
cd salon_managment
flask db migrate -m "describe change"
flask db upgrade
```
- Note: there is no established automated test suite yet; validate changes with lint/build and targeted manual API/UI checks.

## Architecture
- Frontend is feature-first under `salon_frontend/src/features/*`.
- Frontend routing is modular in `src/app/routes` (`publicRoutes.jsx`, `dashboardRoutes.jsx`) and assembled by `AppRouter`.
- Frontend API access uses centralized Axios client + interceptors in `src/api/axios.js`.
- Frontend token handling is centralized in `src/core/auth/tokenStorage.js`.
- Backend follows Controller -> Service -> Repository -> Model layering under `salon_managment/app`.
- Backend Flask extensions are centralized in `app/core/extensions.py`.
- Backend blueprint registration is centralized in `app/core/blueprints.py` and loaded from `app/routes.py`.

## Conventions
- Keep API response handling compatible with `extractData` in `salon_frontend/src/core/api/response.js` (`{ success, data, error }` envelope is common).
- Use frontend alias `@` for imports from `src` where practical (configured in Vite).
- Keep feature data contracts consistent (keys are expected in lowercase in several forms/hooks/pages).
- Use centralized auth helpers (`getToken`, `setToken`, `clearToken`) instead of direct localStorage access.
- Backend entities commonly use soft delete via `is_active`; preserve this behavior in repository/service changes.
- Preserve import compatibility shims (for example `app/extensions.py` re-export behavior).

## Pitfalls
- For browser FormData requests, do not force `Content-Type: multipart/form-data`; let Axios/browser set the boundary.
- Frontend dev server expects backend at `http://localhost:5000` through Vite proxy `/api`.
- Backend seeds a default role/member on startup (`seed_default_member`); account for this when debugging startup behavior.
- In products backend, repository method naming matters (`get_product_by_id` is used, not `get_by_id`).
- Keep auth blueprint registration intact so `/api/login` remains available.

## Reference Files
- `salon_frontend/vite.config.js`
- `salon_frontend/src/api/axios.js`
- `salon_frontend/src/core/api/response.js`
- `salon_frontend/src/core/auth/tokenStorage.js`
- `salon_frontend/src/app/routes/dashboardRoutes.jsx`
- `salon_managment/run.py`
- `salon_managment/app/__init__.py`
- `salon_managment/app/core/extensions.py`
- `salon_managment/app/core/blueprints.py`
- `salon_managment/config.py`
