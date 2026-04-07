import { ArrowLeft } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import './EntityView.css';

function EntityFormView({ title, onBack, children }) {
  return (
    <section className="entity-view entity-view-form">
      <header className="entity-view-header entity-view-header-form">
        <Button onClick={onBack} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 className="entity-view-title">{title}</h1>
        <div className="entity-view-header-spacer" />
      </header>

      <Card>{children}</Card>
    </section>
  );
}

export default EntityFormView;
