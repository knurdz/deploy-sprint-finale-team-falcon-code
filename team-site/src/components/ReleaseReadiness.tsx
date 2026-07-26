import {
  releaseReadinessItems,
  releaseReadinessTask,
} from '../data/releaseReadiness';

export function ReleaseReadiness() {
  return (
    <section
      className="panel releaseReadiness"
      id="release-readiness"
      aria-labelledby="release-readiness-title"
    >
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Provided feature bundle</p>
          <h2 id="release-readiness-title">T13 release readiness</h2>
        </div>
        <span>{releaseReadinessItems.length} checks</span>
      </div>

      <ul className="readinessList">
        {releaseReadinessItems.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <strong className={`readinessStatus ${item.status}`}>
              {item.status}
            </strong>
          </li>
        ))}
      </ul>

      <p className="readinessSource">
        Task {releaseReadinessTask.task} · {releaseReadinessTask.source}
      </p>
    </section>
  );
}
