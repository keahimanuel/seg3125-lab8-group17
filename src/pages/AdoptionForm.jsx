import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPet, postApplication } from '../api';
import ProgressBar from '../components/ProgressBar';

const totalSteps = 3;

function AdoptionForm() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    housingType: '',
    activityLevel: '',
    reason: '',
    agreement: false,
  });

  useEffect(() => {
    fetchPet(id).then(setPet);
  }, [id]);

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.';
      if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    }

    if (step === 2) {
      if (!formData.housingType.trim()) nextErrors.housingType = 'Housing type is required.';
      if (!formData.activityLevel.trim()) nextErrors.activityLevel = 'Activity level is required.';
    }

    if (step === 3) {
      if (!formData.reason.trim()) nextErrors.reason = 'Please explain why you want to adopt this pet.';
      if (!formData.agreement) nextErrors.agreement = 'You must confirm before submitting.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    await postApplication({
      user_id: 1,
      pet_id: Number(id),
      status: 'submitted',
      housing_type: formData.housingType,
      notes: `Activity level: ${formData.activityLevel}. Reason: ${formData.reason}`,
    });

    setSubmitted(true);
  };

  if (!pet) {
    return (
      <div className="container page-content empty-state">
        <h2>Pet not found</h2>
        <Link to="/pets" className="button primary-button">Back to Browse Pets</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container page-content">
        <section className="card success-box">
          <p className="eyebrow">Following instructions</p>
          <h2>Application submitted</h2>
          <p>
            Thank you, {formData.fullName}. Your application for {pet.name} has been saved.
          </p>
          <Link to="/messages" className="button primary-button">Go to Messages</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">Following instructions</p>
        <h2>Adoption Application for {pet.name}</h2>
        <p>Complete the guided form step by step. Required fields are validated before you move on.</p>
      </section>

      <section className="card form-card">
        <ProgressBar step={step} totalSteps={totalSteps} />

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <label>
                Full Name
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <label>
                Housing Type
                <select
                  value={formData.housingType}
                  onChange={(e) => handleChange('housingType', e.target.value)}
                >
                  <option value="">Select one</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                </select>
                {errors.housingType && <span className="error-text">{errors.housingType}</span>}
              </label>

              <label>
                Activity Level
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleChange('activityLevel', e.target.value)}
                >
                  <option value="">Select one</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
                {errors.activityLevel && <span className="error-text">{errors.activityLevel}</span>}
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <label>
                Why are you interested in this pet?
                <textarea
                  rows="5"
                  value={formData.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                />
                {errors.reason && <span className="error-text">{errors.reason}</span>}
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={formData.agreement}
                  onChange={(e) => handleChange('agreement', e.target.checked)}
                />
                <span>I confirm the information above is accurate.</span>
              </label>
              {errors.agreement && <span className="error-text">{errors.agreement}</span>}
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="button secondary-button" onClick={handleBack}>
                Back
              </button>
            )}

            {step < totalSteps ? (
              <button type="button" className="button primary-button" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className="button primary-button">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdoptionForm;
