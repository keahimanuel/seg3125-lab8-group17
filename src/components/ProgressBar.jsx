function ProgressBar({ step, totalSteps }) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="progress-wrapper" aria-label="Application progress">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p>Step {step} of {totalSteps}</p>
    </div>
  );
}

export default ProgressBar;
