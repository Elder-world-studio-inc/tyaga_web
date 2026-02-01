# Tyaga Web Dashboard

This is the web version of the Tyaga Dashboard, designed to be hosted on a Node.js server (e.g., Hostinger VPS or Node.js Hosting).

## Deployment Instructions

1. **Build the Frontend**
   Run the following command locally to build the React frontend:
   ```bash
   npm install
   npm run build
   ```
   This will generate a `dist` folder containing the static files.

2. **Prepare Files for Upload**
   You need to upload the following files/folders to your server:
   - `dist/` (The built frontend)
   - `server.js` (The Node.js backend server)
   - `orchestrator.js` (Backend logic)
   - `n8nService.js` (n8n integration)
   - `config.js` (Configuration)
   - `package.json` (Dependencies)

3. **Upload to Hostinger**
   - Access your Hostinger File Manager or use FTP/SCP.
   - Upload the files to your domain's root directory (e.g., `public_html` or a subfolder if using a subdomain).
   - If using Hostinger's Node.js App manager:
     - Set the **Application Startup File** to `server.js`.
     - Set the **Application Root** to the folder where you uploaded the files.

4. **Install Dependencies on Server**
   - In Hostinger's Node.js manager, click "NPM Install".
   - Or, if you have SSH access:
     ```bash
     cd /path/to/your/app
     npm install --production
     ```

5. **Start the Server**
   - In Hostinger, restart the application.
   - Or via SSH: `node server.js` (Using a process manager like PM2 is recommended: `pm2 start server.js`).

## Environment Configuration

The application uses `config.js` for configuration. You can modify this file or update `server.js` to use environment variables if preferred.

## API Endpoints

The backend provides API endpoints at `/api/...` which mirror the functionality of the desktop app's IPC calls.

- `/api/orchestrator`: Get dashboard data
- `/api/n8n/workflows`: Get n8n workflows
- `/api/agents`: Create agent
- `/api/slots/assign`: Assign agent to slot
- `/api/works`: Create/Register work
- `/api/campaigns`: Create/Trigger campaigns
