import { google } from 'googleapis';

/**
 * Convierte un arreglo bidimensional de filas (devuelto por Google Sheets API)
 * en un arreglo de objetos JSON estructurados basándose en los nombres de las columnas (fila 0).
 */
function parseRowsToObjects(rows) {
  if (!rows || rows.length === 0) return [];
  const headers = rows[0].map(h => String(h || '').trim());
  
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      if (header) {
        const val = row[index];
        obj[header] = val !== undefined && val !== null ? val : null;
      }
    });
    return obj;
  });
}

/**
 * Consulta por lotes (batchGet) los datos del documento de Google Sheets
 * utilizando las credenciales de servicio configuradas en el entorno.
 */
export async function fetchGoogleSheetsData() {
  const rawEmail = process.env.GOOGLE_CLIENT_EMAIL || '';
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const rawId = process.env.SPREADSHEET_ID || '';

  const clientEmail = rawEmail.replace(/^["']|["']$/g, '').trim();
  const spreadsheetId = rawId.replace(/^["']|["']$/g, '').trim();
  const privateKey = rawKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n').trim();

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error('Variables de entorno incompletas para Google Sheets API. Verifique GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY y SPREADSHEET_ID.');
  }

  // Inicializar autenticación de Google Service Account usando GoogleAuth
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [
      'Config!A1:Z100',
      'DB_Usuarios!A1:Z100',
      'Registro_Pagos!A1:Z1000',
      'Dashboard!A1:Z100',
      'KPIs_Globales!A1:Z100',
      'Log-Errores!A1:Z1000',
    ],
    valueRenderOption: 'UNFORMATTED_VALUE',
  });

  const valueRanges = response.data.valueRanges || [];

  const rawConfig = parseRowsToObjects(valueRanges[0]?.values);
  const rawDbUsuarios = parseRowsToObjects(valueRanges[1]?.values).filter(u => u.ID || u.Nombre || u['ID Usuario']);
  const rawRegistroPagos = parseRowsToObjects(valueRanges[2]?.values).filter(p => p.Fecha || p['ID Usuario'] || p.Nombre);
  const rawDashboard = parseRowsToObjects(valueRanges[3]?.values).filter(d => d.ID || d.Nombre);
  const rawKpis = parseRowsToObjects(valueRanges[4]?.values);
  const rawLogErrores = parseRowsToObjects(valueRanges[5]?.values).filter(l => l.Workflow || l['Nodo que Falló'] || l['Detalle del Error']);

  return {
    config: rawConfig,
    dbUsuarios: rawDbUsuarios,
    registroPagos: rawRegistroPagos,
    dashboard: rawDashboard,
    kpis: rawKpis,
    logErrores: rawLogErrores,
  };
}

/**
 * Inserta una nueva fila de abono en la pestaña Registro_Pagos de Google Sheets.
 * Formato de Fila: [Fecha, ID Usuario, Nombre, Monto Pagado]
 */
export async function appendPaymentToGoogleSheets({ fecha, usuarioId, nombre, monto }) {
  const rawEmail = process.env.GOOGLE_CLIENT_EMAIL || '';
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const rawId = process.env.SPREADSHEET_ID || '';

  const clientEmail = rawEmail.replace(/^["']|["']$/g, '').trim();
  const spreadsheetId = rawId.replace(/^["']|["']$/g, '').trim();
  const privateKey = rawKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n').trim();

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error('Variables de entorno incompletas para Google Sheets API.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const values = [[fecha, usuarioId, nombre, Number(monto)]];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Registro_Pagos!A:D',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values,
    },
  });

  return response.data;
}
