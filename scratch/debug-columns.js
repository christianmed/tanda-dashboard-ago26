const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const matchEmail = envContent.match(/GOOGLE_CLIENT_EMAIL=["']?([^"'\n]+)["']?/);
const matchKey = envContent.match(/GOOGLE_PRIVATE_KEY=["']?([\s\S]+?)["']?\n[A-Z_]+=/);
const matchId = envContent.match(/SPREADSHEET_ID=["']?([^"'\n]+)["']?/);

const clientEmail = matchEmail[1].trim();
const privateKey = matchKey[1].trim().replace(/\\n/g, '\n');
const spreadsheetId = matchId[1].trim();

const auth = new google.auth.GoogleAuth({
  credentials: { client_email: clientEmail, private_key: privateKey },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function debugAll() {
  const sheets = google.sheets({ version: 'v4', auth });
  
  const resF = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: ['KPIs_Globales!A1:Z10', 'Dashboard!A1:Z15', 'Registro_Pagos!A1:Z10'],
    valueRenderOption: 'FORMATTED_VALUE'
  });

  const resU = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: ['KPIs_Globales!A1:Z10', 'Dashboard!A1:Z15', 'Registro_Pagos!A1:Z10'],
    valueRenderOption: 'UNFORMATTED_VALUE'
  });

  const kpisF = resF.data.valueRanges[0].values;
  const kpisU = resU.data.valueRanges[0].values;
  console.log('=== KPIS HEADERS ===');
  kpisF[0].forEach((h, i) => console.log(`[${i}] ${h} => Formatted: "${kpisF[1][i]}" | Unformatted: ${kpisU[1][i]}`));

  console.log('\n=== DASHBOARD ROW 1 (Angel) ===');
  resF.data.valueRanges[1].values[0].forEach((h, i) => {
    console.log(`[${i}] ${h} => Formatted: "${resF.data.valueRanges[1].values[1][i]}" | Unformatted: ${resU.data.valueRanges[1].values[1][i]}`);
  });

  console.log('\n=== REGISTRO PAGOS ROW 1 ===');
  resF.data.valueRanges[2].values[0].forEach((h, i) => {
    console.log(`[${i}] ${h} => Formatted: "${resF.data.valueRanges[2].values[1][i]}" | Unformatted: ${resU.data.valueRanges[2].values[1][i]}`);
  });
}

debugAll();
