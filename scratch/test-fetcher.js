const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const matchEmail = envContent.match(/GOOGLE_CLIENT_EMAIL=["']?([^"'\n]+)["']?/);
if (matchEmail) process.env.GOOGLE_CLIENT_EMAIL = matchEmail[1].trim();

const matchKey = envContent.match(/GOOGLE_PRIVATE_KEY=["']?([\s\S]+?)["']?\n[A-Z_]+=/);
if (matchKey) process.env.GOOGLE_PRIVATE_KEY = matchKey[1].trim().replace(/\\n/g, '\n');

const matchId = envContent.match(/SPREADSHEET_ID=["']?([^"'\n]+)["']?/);
if (matchId) process.env.SPREADSHEET_ID = matchId[1].trim();

const { fetchGoogleSheetsData } = require('../lib/googleSheets.js');

async function testFetcher() {
  try {
    console.log('Testing fetchGoogleSheetsData()...');
    const data = await fetchGoogleSheetsData();
    console.log('✅ Google Sheets fetch SUCCESSFUL!');
    console.log('- Participants count:', data.dashboard.length);
    console.log('- KPIs count:', data.kpis.length);
    console.log('- Payments count:', data.registroPagos.length);
  } catch (err) {
    console.error('❌ Fetcher Error:', err);
  }
}

testFetcher();
