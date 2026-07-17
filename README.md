# essethr-frontend

A frontend React application for the EssetHR human resource management platform.

## Local development

1. **Start MongoDB** (if you use Docker from `hr-system`):

   ```bash
   docker compose up -d
   ```

2. **Start the API** from `../backend`:

   ```bash
   cd ../backend
   npm install
   npm run dev
   ```

   Default URL: `http://127.0.0.1:4000` (set `PORT` in `backend/.env` if you change it).

3. **Point this app at the API** — in `.env` (recommended):

   ```env
   REACT_APP_API_URL=http://localhost:4000
   ```

   Use the **same hostname** you type in the browser (`localhost` vs `127.0.0.1`). After **any** `.env` change, stop and restart `npm start` (CRA only reads env at compile time).

   `src/api/request.js` calls this origin directly (`…/api/v1/…`). If the variable is missing in the bundle, **development** still defaults to port **4000** on the same host when you use `localhost` / `127.0.0.1`.

4. **Start the UI**:

   ```bash
   npm install
   npm start
   ```

## Scripts

- `npm start` — Create React App dev server
- `npm run build` — production build
