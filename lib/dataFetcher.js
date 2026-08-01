import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { google } from 'googleapis';

/**
 * Convierte cualquier valor a un número válido (evitando NaN o null)
 */
function cleanNumber(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[\$,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/**
 * Formatea fechas de Excel (números de serie o cadenas ISO/Date) a YYYY-MM-DD
 */
function formatExcelDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'number') {
    const jsDate = new Date(Math.round((val - 25569) * 86400 * 1000));
    if (!isNaN(jsDate.getTime())) return jsDate.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  if (str.includes('T')) return str.split('T')[0];
  return str;
}

/**
 * Lee datos desde Google Sheets API si hay credenciales configuradas,
 * de lo contrario lee el archivo Excel local San-2026-01.xlsx.
 */
export async function getTandaData() {
  const useGoogleSheets = Boolean(
    process.env.SPREADSHEET_ID &&
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );

  if (useGoogleSheets) {
    try {
      return await fetchFromGoogleSheets();
    } catch (err) {
      console.warn('Falló la conexión con Google Sheets API. Usando fallback a Excel local:', err.message);
      return fetchFromLocalExcel();
    }
  }

  return fetchFromLocalExcel();
}

/**
 * Parsea el archivo San-2026-01.xlsx local
 */
function fetchFromLocalExcel() {
  const filePath = path.join(process.cwd(), 'San-2026-01.xlsx');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`El archivo Excel no fue encontrado en: ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });

  const rawConfig = getSheetDataAsJson(workbook, 'Config');
  const rawDbUsuarios = getSheetDataAsJson(workbook, 'DB_Usuarios').filter(u => u.ID || u['ID Usuario'] || u.Nombre);
  const rawRegistroPagos = getSheetDataAsJson(workbook, 'Registro_Pagos').filter(p => p.Fecha || p['ID Usuario'] || p.Nombre);
  const rawDashboard = getSheetDataAsJson(workbook, 'Dashboard').filter(d => d.ID || d.Nombre);
  const rawKpis = getSheetDataAsJson(workbook, 'KPIs_Globales');
  const rawLogErrores = getSheetDataAsJson(workbook, 'Log-Errores').filter(l => l.Workflow || l['Nodo que Falló'] || l['Detalle del Error']);

  return formatTandaData({
    config: rawConfig,
    dbUsuarios: rawDbUsuarios,
    registroPagos: rawRegistroPagos,
    dashboard: rawDashboard,
    kpis: rawKpis,
    logErrores: rawLogErrores,
  });
}

/**
 * Extrae datos desde la API oficial de Google Sheets
 */
async function fetchFromGoogleSheets() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

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
  });

  const valueRanges = response.data.valueRanges || [];

  const rawConfig = parseRowsToObjects(valueRanges[0]?.values);
  const rawDbUsuarios = parseRowsToObjects(valueRanges[1]?.values).filter(u => u.ID || u.Nombre);
  const rawRegistroPagos = parseRowsToObjects(valueRanges[2]?.values).filter(p => p.Fecha || p['ID Usuario'] || p.Nombre);
  const rawDashboard = parseRowsToObjects(valueRanges[3]?.values).filter(d => d.ID || d.Nombre);
  const rawKpis = parseRowsToObjects(valueRanges[4]?.values);
  const rawLogErrores = parseRowsToObjects(valueRanges[5]?.values).filter(l => l.Workflow || l['Nodo que Falló']);

  return formatTandaData({
    config: rawConfig,
    dbUsuarios: rawDbUsuarios,
    registroPagos: rawRegistroPagos,
    dashboard: rawDashboard,
    kpis: rawKpis,
    logErrores: rawLogErrores,
  });
}

/**
 * Convierte una hoja del workbook XLSX a JSON con raw: true para preservar tipos numéricos verdaderos
 */
function getSheetDataAsJson(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true });
}

/**
 * Convierte un arreglo de filas devuelto por Google Sheets API (matriz) a objetos JSON por encabezado
 */
function parseRowsToObjects(rows) {
  if (!rows || rows.length === 0) return [];
  const headers = rows[0].map(h => String(h).trim());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] !== undefined ? row[index] : null;
    });
    return obj;
  });
}

/**
 * Formatea y enriquece los datos procesados para su consumo directo en la UI
 */
function formatTandaData({ config, dbUsuarios, registroPagos, dashboard, kpis, logErrores }) {
  // Mapa de usuarios por ID para obtener imagen y detalles adicionales
  const userMap = {};
  dbUsuarios.forEach(u => {
    const id = String(u.ID || u['ID Usuario'] || '').trim();
    if (id) {
      userMap[id] = u;
    }
  });

  // KPIs Globales (Fila 0 o combinación)
  const kpiRow = kpis[0] || {};
  const configRow = config[0] || {};

  const globalKpis = {
    semanaActual: cleanNumber(kpiRow['Semana Actual'] ?? configRow['Semana Actual'] ?? 0),
    semanasTranscurridas: cleanNumber(kpiRow['Semanas Transcurridas'] ?? configRow['Semanas Transcurridas'] ?? 0),
    semanasRestantes: cleanNumber(kpiRow['Semanas Restantes'] ?? configRow['Semanas Restantes'] ?? 0),
    totalSemanas: cleanNumber(configRow['Total Semanas'] ?? 40),
    proximoParticipante: String(kpiRow['Próximo Participante'] || 'N/A'),
    proximaMoto: String(kpiRow['Próxima Moto'] || 'N/A'),
    costoProximaMoto: cleanNumber(kpiRow['Costo Próxima Moto']),
    fondoProximaMoto: cleanNumber(kpiRow['Fondo Próxima Moto']),
    faltante: cleanNumber(kpiRow['Faltante']),
    cajaTotal: cleanNumber(kpiRow['Caja Total']),
    saldoActual: cleanNumber(kpiRow['Saldo Actual']),
    alDiaCount: cleanNumber(kpiRow['Al Día']),
    adelantadosCount: cleanNumber(kpiRow['Adelantados']),
    enMoraCount: cleanNumber(kpiRow['En Mora']),
  };

  // Dashboard de Participantes
  const participants = dashboard.map(item => {
    const id = String(item.ID || '').trim();
    const userDetail = userMap[id] || {};

    const totalPagado = cleanNumber(item['Total Pagado']);
    const costoMoto = cleanNumber(item['Costo Moto'] || userDetail['Costo Moto']);
    const comision = cleanNumber(userDetail['Comisión']);
    const totalAPagar = cleanNumber(userDetail['Total a Pagar']) || (costoMoto + comision);
    const cuotaSemanal = cleanNumber(item['Cuota Semanal'] ?? item['Cuota Semanal '] ?? userDetail['Cuota Semanal'] ?? userDetail['Cuota Semanal ']);
    const deudaTotal = cleanNumber(item['Deuda Total']);
    const targetAlDia = cleanNumber(item['Target al Día']);
    const saldo = cleanNumber(item['Saldo']);
    const cuotasCompletadas = cleanNumber(item['Cuotas Completadas']);
    const cuotasVencidas = cleanNumber(item['Cuotas Vencidas']);

    // Calcular porcentaje de progreso sin división entre 0
    const porcentajeProgreso = totalAPagar > 0 
      ? Math.min(100, Math.round((totalPagado / totalAPagar) * 100))
      : (costoMoto > 0 ? Math.min(100, Math.round((totalPagado / costoMoto) * 100)) : 0);

    return {
      id,
      nombre: item.Nombre || userDetail.Nombre || 'Sin nombre',
      telegramId: item['Telegram ID'] || userDetail['Telegram ID'] || null,
      modeloMoto: userDetail['Modelo Moto'] || 'N/A',
      imagenMoto: userDetail.Imagen || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=60',
      noAsignado: cleanNumber(item['No. Asignado'] || userDetail['No. Asignado']),
      estado: item.Estado || 'Al Día',
      totalPagado,
      deudaTotal,
      targetAlDia,
      saldo,
      costoMoto,
      cuotaSemanal,
      cuotasCompletadas,
      cuotasVencidas,
      porcentajeProgreso,
      estatusMoto: item['Estatus Moto'] || userDetail['Estatus Moto'] || 'Pendiente',
      fechaEntregaCalculada: formatExcelDate(item['Fecha de Entrega Calculada'] || userDetail['Fecha de Entrega Calculada']),
      registroEntrega: formatExcelDate(item['Registro de Entrega'] || userDetail['Registro de Entrega']),
    };
  });

  // Registro de Pagos
  const payments = registroPagos.map((p, idx) => ({
    id: `pay-${idx}`,
    fecha: formatExcelDate(p.Fecha) || 'N/A',
    usuarioId: p['ID Usuario'] || 'N/A',
    nombre: p.Nombre || 'N/A',
    monto: cleanNumber(p['Monto Pagado'] || p.Monto),
  })).reverse();

  // Log de Errores
  const logs = logErrores.map((log, idx) => ({
    id: `log-${idx}`,
    fechaHora: formatExcelDate(log['Fecha - Hora'] || log['Fecha-Hora']) || String(log['Fecha - Hora'] || log['Fecha-Hora'] || 'N/A'),
    workflow: log.Workflow || 'N/A',
    nodo: log['Nodo que Falló'] || 'N/A',
    modo: log.Modo || 'N/A',
    executionId: log['Execution ID'] || 'N/A',
    detalleError: log['Detalle del Error'] || 'Sin detalle',
  }));

  return {
    kpis: globalKpis,
    participants,
    payments,
    logs,
    rawConfig: configRow,
  };
}
