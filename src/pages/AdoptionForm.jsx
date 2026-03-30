import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPet, postApplication } from '../api';
import { useT } from '../i18n/LanguageContext';
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
  const t = useT();

  useEffect(() => {
    fetchPet(id).then(setPet);
  }, [id]);

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) nextErrors.fullName = t('form.err.fullName');
      if (!formData.email.trim())    nextErrors.email    = t('form.err.email');
    }

    if (step === 2) {
      if (!formData.housingType.trim())  nextErrors.housingType  = t('form.err.housingType');
      if (!formData.activityLevel.trim()) nextErrors.activityLevel = t('form.err.activity');
    }

    if (step === 3) {
      if (!formData.reason.trim())  nextErrors.reason    = t('form.err.reason');
      if (!formData.agreement)      nextErrors.agreement = t('form.err.agreement');
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
        <h2>{t('profile.notFound')}</h2>
        <Link to="/pets" className="button primary-button">{t('profile.back')}</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container page-content">
        <section className="card success-box">
          <p className="eyebrow">{t('form.success.eyebrow')}</p>
          <h2>{t('form.success.heading')}</h2>
          <p>{t('form.success.body', { name: formData.fullName, pet: pet.name })}</p>
          <Link to="/messages" className="button primary-button">{t('form.success.messages')}</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">{t('form.eyebrow')}</p>
        <h2>{t('form.heading', { name: pet.name })}</h2>
        <p>{t('form.description')}</p>
      </section>

      <section className="card form-card">
        <ProgressBar step={step} totalSteps={totalSteps} />

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <label>
                {t('form.fullName')}
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </label>

              <label>
                {t('form.email')}
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
                {t('form.housingType')}
                <select
                  value={formData.housingType}
                  onChange={(e) => handleChange('housingType', e.target.value)}
                >
                  <option value="">{t('form.selectOne')}</option>
                  <option value="Apartment">{t('form.apartment')}</option>
                  <option value="House">{t('form.house')}</option>
                  <option value="Condo">{t('form.condo')}</option>
                </select>
                {errors.housingType && <span className="error-text">{errors.housingType}</span>}
              </label>

              <label>
                {t('form.activityLevel')}
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleChange('activityLevel', e.target.value)}
                >
                  <option value="">{t('form.selectOne')}</option>
                  <option value="Low">{t('form.low')}</option>
                  <option value="Moderate">{t('form.moderate')}</option>
                  <option value="High">{t('form.high')}</option>
                </select>
                {errors.activityLevel && <span className="error-text">{errors.activityLevel}</span>}
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <label>
                {t('form.reason')}
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
                <span>{t('form.agreement')}</span>
              </label>
              {errors.agreement && <span className="error-text">{errors.agreement}</span>}
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="button secondary-button" onClick={handleBack}>
                {t('form.back')}
              </button>
            )}

            {step < totalSteps ? (
              <button type="button" className="button primary-button" onClick={handleNext}>
                {t('form.next')}
              </button>
            ) : (
              <button type="submit" className="button primary-button">
                {t('form.submit')}
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdoptionForm;
