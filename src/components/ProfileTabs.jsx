import { useT } from '../i18n/LanguageContext';

function ProfileTabs({ activeTab, setActiveTab, pet }) {
  const t = useT();
  return (
    <div>
      <div className="tab-buttons">
        <button className={activeTab === 'about'   ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('about')}>{t('tabs.about')}</button>
        <button className={activeTab === 'medical' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('medical')}>{t('tabs.medical')}</button>
        <button className={activeTab === 'care'    ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('care')}>{t('tabs.care')}</button>
      </div>

      <div className="tab-panel">
        {activeTab === 'about' && (
          <div>
            <p>{pet.description}</p>
            <div className="tag-list">
              {pet.temperament.map((trait) => (
                <span key={trait} className="tag">{trait}</span>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'medical' && <p>{pet.medicalHistory}</p>}
        {activeTab === 'care'    && <p>{pet.careGuide}</p>}
      </div>
    </div>
  );
}

export default ProfileTabs;
