import { Edit2, Trash2 } from 'lucide-react';
import './Table.css';

function Table({ columns = [], data = [], onEdit, onDelete, customActions }) {
  const dataArray = Array.isArray(data) ? data : [];
  const columnsArray = Array.isArray(columns) ? columns : [];
  
  return (
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
          {dataArray.length === 0 ? (
            <tr>
              <td
                colSpan={columnsArray.length + (onEdit || onDelete || customActions ? 1 : 0)}
                className="table-empty-cell"
              >
                No hay datos para mostrar
              </td>
            </tr>
          ) : (
            dataArray.map((row, index) => (
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
  );
}

export default Table;
