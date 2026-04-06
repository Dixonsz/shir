import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import apiClient from '../../api/axios';
import { showToast } from '../../providers/ToastProvider';
import { resolveDateRange } from '../../providers/TableFiltersProvider';
import { reportsApi } from './api/reports.api';
import { useReports } from './hooks/useReports';
import './ReportsPage.css';

function currency(value) {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(numeric);
}

function numberValue(value) {
  return new Intl.NumberFormat('es-CR').format(Number(value || 0));
}

function formatDateLabel(dateString) {
  if (!dateString) return '-';
  const dateValue = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(dateValue.getTime())) return dateString;
  return dateValue.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' });
}

function FilterSection({ datePreset, setDatePreset, customFromDate, setCustomFromDate, customToDate, setCustomToDate, status, setStatus, exportType, setExportType, onExport }) {
  return (
    <section className="reports-filters">
      <div className="reports-filter-row">
        <label htmlFor="reports-date-preset">Periodo</label>
        <select
          id="reports-date-preset"
          value={datePreset}
          onChange={(event) => setDatePreset(event.target.value)}
        >
          <option value="week">Ultimos 7 dias</option>
          <option value="month">Ultimos 30 dias</option>
          <option value="custom">Rango personalizado</option>
        </select>
      </div>

      {datePreset === 'custom' ? (
        <div className="reports-filter-row reports-custom-dates">
          <div>
            <label htmlFor="reports-from">Desde</label>
            <input
              id="reports-from"
              type="date"
              value={customFromDate}
              onChange={(event) => setCustomFromDate(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="reports-to">Hasta</label>
            <input
              id="reports-to"
              type="date"
              value={customToDate}
              onChange={(event) => setCustomToDate(event.target.value)}
            />
          </div>
        </div>
      ) : null}

      <div className="reports-filter-row">
        <label htmlFor="reports-status">Estado cita</label>
        <select id="reports-status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="completed">Completadas</option>
          <option value="all">Todas</option>
          <option value="scheduled">Programadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      <div className="reports-filter-row reports-export-row">
        <div>
          <label htmlFor="reports-export">Exportar CSV</label>
          <select
            id="reports-export"
            value={exportType}
            onChange={(event) => setExportType(event.target.value)}
          >
            <option value="services">Servicios</option>
            <option value="products">Productos</option>
            <option value="clients">Clientes</option>
            <option value="members">Miembros</option>
            <option value="revenue">Ingresos</option>
          </select>
        </div>

        <button type="button" className="btn btn-primary" onClick={onExport}>
          Descargar CSV
        </button>
      </div>
    </section>
  );
}

function ReportsPage() {
  const [datePreset, setDatePreset] = useState('month');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [status, setStatus] = useState('completed');
  const [exportType, setExportType] = useState('services');

  const dateRange = useMemo(
    () => resolveDateRange(datePreset, customFromDate, customToDate),
    [customFromDate, customToDate, datePreset]
  );

  const filters = useMemo(
    () => ({
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      status,
      limit: 10,
    }),
    [dateRange.fromDate, dateRange.toDate, status]
  );

  const {
    loading,
    error,
    summary,
    services,
    products,
    clients,
    members,
    revenueTimeline,
    inventory,
    refresh,
  } = useReports(filters);

  const handleExportCsv = async () => {
    try {
      const endpoint = reportsApi.exportCsvUrl(exportType, filters);
      const response = await apiClient.get(endpoint, { responseType: 'blob' });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.setAttribute('download', `reporte_${exportType}.csv`);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);

      showToast.success('CSV descargado con exito.');
    } catch (downloadError) {
      showToast.error(downloadError?.userMessage || 'No se pudo descargar el CSV.');
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reportes de Gestion</h1>
          <p>Analiza servicios, productos, clientes, miembros, ingresos e inventario.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={refresh}>
          Actualizar
        </button>
      </div>

      <FilterSection
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        customFromDate={customFromDate}
        setCustomFromDate={setCustomFromDate}
        customToDate={customToDate}
        setCustomToDate={setCustomToDate}
        status={status}
        setStatus={setStatus}
        exportType={exportType}
        setExportType={setExportType}
        onExport={handleExportCsv}
      />

      {error ? <div className="reports-error">{error}</div> : null}

      <section className="reports-kpi-grid">
        <article className="reports-kpi-card">
          <h3>Total citas</h3>
          <p>{numberValue(summary?.total_appointments)}</p>
        </article>
        <article className="reports-kpi-card">
          <h3>Citas completadas</h3>
          <p>{numberValue(summary?.completed_appointments)}</p>
        </article>
        <article className="reports-kpi-card">
          <h3>Ingresos</h3>
          <p>{currency(summary?.total_revenue)}</p>
        </article>
        <article className="reports-kpi-card">
          <h3>Ticket promedio</h3>
          <p>{currency(summary?.avg_appointment_value)}</p>
        </article>
      </section>

      <section className="reports-grid-two">
        <article className="reports-panel">
          <h2>Servicios mas usados</h2>
          <div className="reports-chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={services}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service_name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="times_used" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="reports-panel">
          <h2>Ingresos por dia</h2>
          <div className="reports-chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTimeline.map((item) => ({ ...item, date_label: formatDateLabel(item.date) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date_label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="reports-grid-two">
        <article className="reports-panel">
          <h2>Productos mas usados</h2>
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Unidades</th>
                  <th>Ingresos</th>
                  <th>Servicios relacionados</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product_id}>
                    <td>{product.product_name}</td>
                    <td>{numberValue(product.units_used)}</td>
                    <td>{currency(product.revenue)}</td>
                    <td>{(product.related_services || []).join(', ') || '-'}</td>
                  </tr>
                ))}
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Sin datos para el periodo seleccionado.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>

        <article className="reports-panel">
          <h2>Inventario</h2>
          <div className="reports-inventory-kpis">
            <div>
              <span>Bajo stock</span>
              <strong>{numberValue(inventory?.low_stock?.length)}</strong>
            </div>
            <div>
              <span>Sin stock</span>
              <strong>{numberValue(inventory?.out_of_stock?.length)}</strong>
            </div>
            <div>
              <span>Valor inventario</span>
              <strong>{currency(inventory?.total_inventory_value)}</strong>
            </div>
          </div>
          <ul className="reports-list">
            {(inventory?.low_stock || []).slice(0, 8).map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <strong>{item.stock}</strong>
              </li>
            ))}
            {(inventory?.low_stock || []).length === 0 ? <li>No hay productos en bajo stock.</li> : null}
          </ul>
        </article>
      </section>

      <section className="reports-grid-two">
        <article className="reports-panel">
          <h2>Top clientes</h2>
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Citas</th>
                  <th>Gasto</th>
                  <th>Ultima cita</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.client_id}>
                    <td>{client.client_name}</td>
                    <td>{numberValue(client.total_appointments)}</td>
                    <td>{currency(client.total_spent)}</td>
                    <td>{client.last_appointment ? new Date(client.last_appointment).toLocaleString('es-CR') : '-'}</td>
                  </tr>
                ))}
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Sin datos para el periodo seleccionado.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>

        <article className="reports-panel">
          <h2>Desempeno miembros</h2>
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Miembro</th>
                  <th>Citas</th>
                  <th>Ingresos</th>
                  <th>Ticket prom.</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.member_id}>
                    <td>{member.member_name}</td>
                    <td>{numberValue(member.total_appointments)}</td>
                    <td>{currency(member.total_revenue_generated)}</td>
                    <td>{currency(member.avg_ticket)}</td>
                  </tr>
                ))}
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Sin datos para el periodo seleccionado.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {loading ? <div className="reports-loading">Actualizando reportes...</div> : null}
    </div>
  );
}

export default ReportsPage;
