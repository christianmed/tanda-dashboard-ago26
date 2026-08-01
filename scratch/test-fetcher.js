const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const matchEmail = envContent.match(/GOOGLE_CLIENT_EMAIL=["']?([^"'\n]+)["']?/);
if (matchEmail) process.env.GOOGLE_CLIENT_EMAIL = matchEmail[1].trim();

const matchKey = envContent.match(/GOOGLE_PRIVATE_KEY=["']?([\s\S]+?)["']?\n[A-Z_]+=/);
if (matchKey) process.env.GOOGLE_PRIVATE_KEY = matchKey[1].trim().replace(/\\n/g, '\n');

const matchId = envContent.match(/SPREADSHEET_ID=["']?([^"'\n]+)["']?/);
if (matchId) process.env.SPREADSHEET_ID = matchId[1].trim();

const { getTandaData } = require('../lib/dataFetcher.js');

async function testFull() {
  const data = await getTandaData();
  console.log('=== PROCESSED DATA FROM GOOGLE SHEETS ===');
  console.log('KPIs:', JSON.stringify(data.kpis, null, 2));
  console.log('\nAngel (P1):', JSON.stringify(data.participants[0], null, 2));
  console.log('\nIndira (P7):', JSON.stringify(data.participants[6], null, 2));
}

testFull();
