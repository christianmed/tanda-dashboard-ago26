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

async function inspectRawSheets() {
  const sheets = google.sheets({ version: 'v4', auth });
  
  const resFormatted = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: ['KPIs_Globales!A1:Z10', 'Dashboard!A1:Z15', 'Registro_Pagos!A1:Z10'],
    valueRenderOption: 'FORMATTED_VALUE'
  });
  
  const resUnformatted = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: ['KPIs_Globales!A1:Z10', 'Dashboard!A1:Z15', 'Registro_Pagos!A1:Z10'],
    valueRenderOption: 'UNFORMATTED_VALUE'
  });

  console.log('=== FORMATTED_VALUE ===');
  console.log('KPIs Headers:', resFormatted.data.valueRanges[0].values[0]);
  console.log('KPIs Values:', resFormatted.data.valueRanges[0].values[1]);
  console.log('\nDashboard Headers:', resFormatted.data.valueRanges[1].values[0]);
  console.log('Dashboard Row 1:', resFormatted.data.valueRanges[1].values[1]);
  console.log('Dashboard Row 2:', resFormatted.data.valueRanges[1].values[2]);
  
  console.log('\n=== UNFORMATTED_VALUE ===');
  console.log('KPIs Values:', resUnformatted.data.valueRanges[0].values[1]);
  console.log('Dashboard Row 1:', resUnformatted.data.valueRanges[1].values[1]);
  console.log('Dashboard Row 2:', resUnformatted.data.valueRanges[1].values[2]);
}

inspectRawSheets();
