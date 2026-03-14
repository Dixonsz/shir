import { Plus } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import './EntityView.css';

function EntityListView({
  title,
  description,
  actionLabel = 'Nuevo',
  onCreate,
  loading,
  error,
  children,
}) {
  return (
    <section className="entity-view entity-view-list">
      <header className="entity-view-header">
        <div>
          <h1 className="entity-view-title">{title}</h1>
          {description ? <p className="entity-view-description">{description}</p> : null}
        </div>
        {onCreate ? (
          <Button onClick={onCreate} variant="primary">
            <Plus size={20} />
            {actionLabel}
          </Button>
        ) : null}
      </header>

      <Card>
        {loading ? <p className="entity-view-feedback">Cargando...</p> : null}
        {!loading && error ? <p className="entity-view-feedback entity-view-feedback-error">{error}</p> : null}
        {!loading && !error ? children : null}
      </Card>
    </section>
  );
}

export default EntityListView;
