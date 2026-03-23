function ProfileTabs({ activeTab, setActiveTab, pet }) {
  return (
    <div>
      <div className="tab-buttons">
        <button className={activeTab === 'about' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('about')}>
          About
        </button>
        <button className={activeTab === 'medical' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('medical')}>
          Medical History
        </button>
        <button className={activeTab === 'care' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('care')}>
          Care Guide
        </button>
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
        {activeTab === 'care' && <p>{pet.careGuide}</p>}
      </div>
    </div>
  );
}

export default ProfileTabs;
