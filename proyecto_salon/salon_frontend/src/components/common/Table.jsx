import { useMemo, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useTableFilters } from '../../providers/TableFiltersProvider';
import './Table.css';

const DATE_KEY_PATTERN = /date|created|updated|at$/i;

function safeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).toLowerCase();
    } catch {
      return '';
    }
  }
  return String(value).toLowerCase();
}

function stripDiacritics(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeSearchableText(value) {
  return stripDiacritics(normalizeText(value))
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  if (!text) return [];
  return text.split(' ').filter(Boolean);
}

function getEditDistanceWithinLimit(source, target, limit) {
  const sourceLength = source.length;
  const targetLength = target.length;

  if (Math.abs(sourceLength - targetLength) > limit) {
    return limit + 1;
  }

  let previous = Array(targetLength + 1)
    .fill(0)
    .map((_, index) => index);

  for (let i = 1; i <= sourceLength; i += 1) {
    const current = [i];
    let rowMin = current[0];

    for (let j = 1; j <= targetLength; j += 1) {
      const substitutionCost = source[i - 1] === target[j - 1] ? 0 : 1;
      const value = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + substitutionCost
      );

      current.push(value);
      if (value < rowMin) rowMin = value;
    }

    if (rowMin > limit) {
      return limit + 1;
    }

    previous = current;
  }

  return previous[targetLength];
}

function isApproximateTokenMatch(queryToken, rowToken) {
  if (!queryToken || !rowToken) return false;

  if (rowToken.includes(queryToken) || queryToken.includes(rowToken)) {
    return true;
  }

  const maxLength = Math.max(queryToken.length, rowToken.length);
  const allowedDistance = maxLength >= 7 ? 2 : 1;
  const distance = getEditDistanceWithinLimit(queryToken, rowToken, allowedDistance);
  return distance <= allowedDistance;
}

function matchesApproximateQuery(rowText, query) {
  if (!query) return true;
  if (!rowText) return false;

  if (rowText.includes(query)) {
    return true;
  }

  const rowTokens = tokenize(rowText);
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return true;
  }

  return queryTokens.every((queryToken) =>
    rowTokens.some((rowToken) => isApproximateTokenMatch(queryToken, rowToken))
  );
}

function Table({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  customActions,
  enableGlobalFilters = true,
  showInlineFilters = false,
}) {
  const dataArray = Array.isArray(data) ? data : [];
  const columnsArray = Array.isArray(columns) ? columns : [];
  const {
    searchQuery,
    fromDate: globalFromDate,
    toDate: globalToDate,
    sortOrder: globalSortOrder,
  } = useTableFilters();

  const dateColumns = useMemo(() => {
    return columnsArray.filter((column) => DATE_KEY_PATTERN.test(column.key));
  }, [columnsArray]);

  const [search, setSearch] = useState('');
  const [dateField, setDateField] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dateOrder, setDateOrder] = useState('none');

  const resolvedDateField = dateField || (dateColumns[0]?.key ?? '');

  const filteredData = useMemo(() => {
    let rows = [...dataArray];

    if (!enableGlobalFilters) {
      return rows;
    }

    const query = normalizeSearchableText(searchQuery || (showInlineFilters ? search : ''));
    if (query) {
      rows = rows.filter((row) => {
        const rawText = columnsArray
          .map((column) => normalizeText(row[column.key]))
          .join(' ');
        const searchableRowText = normalizeSearchableText(rawText);
        return matchesApproximateQuery(searchableRowText, query);
      });
    }

    if (resolvedDateField) {
      const from = globalFromDate || (showInlineFilters && fromDate ? safeDate(`${fromDate}T00:00:00`) : null);
      const to = globalToDate || (showInlineFilters && toDate ? safeDate(`${toDate}T23:59:59`) : null);

      if (from || to) {
        rows = rows.filter((row) => {
          const itemDate = safeDate(row[resolvedDateField]);
          if (!itemDate) return false;
          if (from && itemDate < from) return false;
          if (to && itemDate > to) return false;
          return true;
        });
      }

      const order = globalSortOrder === 'none' ? (showInlineFilters ? dateOrder : 'none') : globalSortOrder;
      if (order === 'recent' || order === 'oldest' || order === 'asc' || order === 'desc') {
        rows.sort((left, right) => {
          const leftDate = safeDate(left[resolvedDateField]);
          const rightDate = safeDate(right[resolvedDateField]);

          if (!leftDate && !rightDate) return 0;
          if (!leftDate) return 1;
          if (!rightDate) return -1;

          return order === 'recent' || order === 'desc'
            ? rightDate.getTime() - leftDate.getTime()
            : leftDate.getTime() - rightDate.getTime();
        });
      }
    }

    return rows;
  }, [
    columnsArray,
    dataArray,
    dateOrder,
    enableGlobalFilters,
    globalFromDate,
    globalSortOrder,
    globalToDate,
    fromDate,
    resolvedDateField,
    search,
    searchQuery,
    showInlineFilters,
    toDate,
  ]);

  const clearFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setDateOrder('none');
    setDateField('');
  };
  
  return (
    <div className="table-wrapper">
      {showInlineFilters ? (
        <div className="table-filters">
          <input
            className="table-filter-input"
            type="text"
            placeholder="Buscar en registros..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {dateColumns.length > 0 ? (
            <>
              <select
                className="table-filter-select"
                value={resolvedDateField}
                onChange={(event) => setDateField(event.target.value)}
              >
                {dateColumns.map((column) => (
                  <option key={column.key} value={column.key}>
                    Fecha: {column.label}
                  </option>
                ))}
              </select>

              <input
                className="table-filter-date"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
              />
              <input
                className="table-filter-date"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
              />

              <select
                className="table-filter-select"
                value={dateOrder}
                onChange={(event) => setDateOrder(event.target.value)}
              >
                <option value="none">Sin ordenar por fecha</option>
                <option value="recent">Mas recientes</option>
                <option value="oldest">Mas antiguos</option>
              </select>
            </>
          ) : null}

          <button type="button" className="table-filter-clear" onClick={clearFilters}>
            Limpiar
          </button>
        </div>
      ) : null}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columnsArray.map((column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete || customActions) && (
                <th>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columnsArray.length + (onEdit || onDelete || customActions ? 1 : 0)}
                  className="table-empty-cell"
                >
                  No hay datos para mostrar
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={row.id || index}>
                  {columnsArray.map((column) => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || customActions) && (
                    <td>
                      <div className="table-actions">
                        {customActions && customActions(row)}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="table-icon-btn"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="table-icon-btn table-delete-icon-btn"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;

