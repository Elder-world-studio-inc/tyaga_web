export const config = {
  // VPS IP Address
  API_BASE_URL: 'http://76.13.113.206/api',
  
  // N8N URL (proxied via Nginx)
  N8N_URL: 'http://76.13.113.206/n8n/',

  // API Key for automation
  N8N_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOThiOGMxNC0wM2FhLTQ1ZmYtYTU1Ni01Yjk0MTBjM2RiMDQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY5OTU3MzIyfQ.1h-Xc53oZfQuLlKJf5skSpnv58aKwxDibgr_Ad2AvXg',

  // MCP Server Configuration
  N8N_MCP: {
    url: 'http://76.13.113.206/n8n/mcp-server/http',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOThiOGMxNC0wM2FhLTQ1ZmYtYTU1Ni01Yjk0MTBjM2RiMDQiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjVmOTlhODI1LTk1ODctNDdiZC1hZGQyLWNhMTNmZTdkMTIzMiIsImlhdCI6MTc2OTk1NzQxOX0.K56SXp9_C780KFROh-93NtIk8dOhY81IcOBaqFJkwFQ'
  }
};
