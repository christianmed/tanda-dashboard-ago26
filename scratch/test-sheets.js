const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Parse .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let clientEmail = '';
let privateKey = '';
let spreadsheetId = '';

const matchEmail = envContent.match(/GOOGLE_CLIENT_EMAIL=["']?([^"'\n]+)["']?/);
if (matchEmail) clientEmail = matchEmail[1].trim();

const matchKey = envContent.match(/GOOGLE_PRIVATE_KEY=["']?([\s\S]+?)["']?\n[A-Z_]+=/);
if (matchKey) {
  privateKey = matchKey[1].trim().replace(/\\n/g, '\n');
}

const matchId = envContent.match(/SPREADSHEET_ID=["']?([^"'\n]+)["']?/);
if (matchId) spreadsheetId = matchId[1].trim();

console.log('Client Email:', clientEmail);
console.log('Spreadsheet ID:', spreadsheetId);
console.log('Private Key Valid:', privateKey.includes('BEGIN PRIVATE KEY'));

async function runTest() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: ['Config!A1:Z10', 'Dashboard!A1:Z10'],
    });

    console.log('\n✅ Connection SUCCESSFUL!');
    console.log('Ranges returned:', response.data.valueRanges?.length);
    response.data.valueRanges?.forEach(vr => {
      console.log(`- Range ${vr.range}: ${vr.values?.length || 0} rows`);
    });
  } catch (err) {
    console.error('\n❌ Connection FAILED:', err.message);
    if (err.response?.data) {
      console.error('Error Details:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

runTest();
