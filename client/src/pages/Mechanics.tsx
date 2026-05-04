import React, { useState, useEffect } from 'react';
import { getMechanics, createMechanic, updateMechanic, deleteMechanic } from '../api';
import { useAuth } from '../api/AuthContext';

interface MechanicCard {
  id: string;
  title: string;
  content: string;
}

interface Mechanic {
  id: string;
  title: string;
  cards: MechanicCard[];
}

const Mechanics: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Состояние для формы раздела
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionFormData, setSectionFormData] = useState({ title: '' });

  // Состояние для формы карточки
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardFormData, setCardFormData] = useState({ title: '', content: '' });

  const fetchMechanics = async () => {
    setLoading(true);
    try {
      const res = await getMechanics();
      setMechanics(res.data);
      if (res.data.length > 0 && !activeTab) {
        setActiveTab(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  // Обработка разделов
  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSectionId) {
        const current = mechanics.find(m => m.id === editingSectionId);
        const res = await updateMechanic(editingSectionId, { ...current, title: sectionFormData.title });
        setMechanics(mechanics.map(m => m.id === editingSectionId ? res.data : m));
      } else {
        const newId = sectionFormData.title.toLowerCase().replace(/\s+/g, '-');
        const res = await createMechanic({ title: sectionFormData.title, id: newId, cards: [] });
        setMechanics([...mechanics, res.data]);
        setActiveTab(res.data.id);
      }
      setIsSectionFormOpen(false);
      setEditingSectionId(null);
      setSectionFormData({ title: '' });
    } catch (err) {
      alert('Ошибка при сохранении раздела');
    }
  };

  const handleSectionDelete = async () => {
    if (window.confirm('Удалить весь этот раздел со всеми карточками?')) {
      try {
        await deleteMechanic(activeTab);
        const newMechanics = mechanics.filter(m => m.id !== activeTab);
        setMechanics(newMechanics);
        setActiveTab(newMechanics.length > 0 ? newMechanics[0].id : '');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Обработка карточек
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentSection = mechanics.find(m => m.id === activeTab);
      if (!currentSection) return;

      let updatedCards;
      const existingCards = currentSection.cards || [];
      if (editingCardId) {
        updatedCards = existingCards.map(c => 
          c.id === editingCardId ? { ...c, ...cardFormData } : c
        );
      } else {
        const newCardId = `card-${Date.now()}`;
        updatedCards = [...existingCards, { id: newCardId, ...cardFormData }];
      }

      const res = await updateMechanic(activeTab, { ...currentSection, cards: updatedCards });
      setMechanics(mechanics.map(m => m.id === activeTab ? res.data : m));
      
      setIsCardFormOpen(false);
      setEditingCardId(null);
      setCardFormData({ title: '', content: '' });
    } catch (err) {
      alert('Ошибка при сохранении карточки');
    }
  };

  const handleCardEdit = (card: MechanicCard) => {
    setEditingCardId(card.id);
    setCardFormData({ title: card.title, content: card.content });
    setIsCardFormOpen(true);
  };

  const handleCardDelete = async (cardId: string) => {
    if (window.confirm('Удалить эту карточку?')) {
      try {
        const currentSection = mechanics.find(m => m.id === activeTab);
        if (!currentSection) return;

        const updatedCards = (currentSection.cards || []).filter(c => c.id !== cardId);
        const res = await updateMechanic(activeTab, { ...currentSection, cards: updatedCards });
        setMechanics(mechanics.map(m => m.id === activeTab ? res.data : m));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Загрузка данных из терминала...</div>;

  const currentMechanic = mechanics.find(m => m.id === activeTab);

  return (
    <div className="mechanics-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>МЕХАНИКИ ВЫЖИВАНИЯ</h1>
        {isLoggedIn && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" style={{ color: 'yellow' }} onClick={() => { setIsSectionFormOpen(true); setEditingSectionId(null); setSectionFormData({ title: '' }); }}>
              + НОВЫЙ РАЗДЕЛ
            </button>
          </div>
        )}
      </div>
      
      {/* Форма раздела */}
      {isSectionFormOpen && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '30px', border: '2px solid yellow' }}>
          <h3>{editingSectionId ? 'РЕДАКТИРОВАНИЕ РАЗДЕЛА' : 'НОВЫЙ РАЗДЕЛ МЕХАНИК'}</h3>
          <form onSubmit={handleSectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>НАЗВАНИЕ РАЗДЕЛА:</label>
            <input 
              type="text" 
              value={sectionFormData.title} 
              onChange={(e) => setSectionFormData({ title: e.target.value })} 
              required 
              style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} 
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn" style={{ background: 'yellow', color: 'black', flex: 1 }}>СОХРАНИТЬ</button>
              <button type="button" className="btn" onClick={() => setIsSectionFormOpen(false)} style={{ flex: 1 }}>ОТМЕНА</button>
            </div>
          </form>
        </div>
      )}

      {/* Вкладки разделов */}
      <div className="category-buttons" style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {mechanics.map(m => (
          <button 
            key={m.id} 
            className="btn" 
            style={{ 
              background: activeTab === m.id ? '#18ff62' : '#004400',
              color: activeTab === m.id ? 'black' : '#18ff62'
            }}
            onClick={() => setActiveTab(m.id)}
          >
            {m.title}
          </button>
        ))}
        {isLoggedIn && activeTab && (
          <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
            <button className="btn" style={{ fontSize: '0.7em', padding: '5px' }} onClick={() => { setEditingSectionId(activeTab); setSectionFormData({ title: currentMechanic?.title || '' }); setIsSectionFormOpen(true); }}>ИЗМ РАЗДЕЛ</button>
            <button className="btn" style={{ fontSize: '0.7em', padding: '5px', color: 'red' }} onClick={handleSectionDelete}>УДЛ РАЗДЕЛ</button>
          </div>
        )}
      </div>

      {/* Список карточек раздела */}
      {currentMechanic ? (
        <div className="mechanic-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: 'yellow', margin: 0 }}>{currentMechanic.title}</h2>
            {isLoggedIn && (
              <button className="btn" style={{ color: '#18ff62' }} onClick={() => { setIsCardFormOpen(true); setEditingCardId(null); setCardFormData({ title: '', content: '' }); }}>
                + ДОБАВИТЬ КАРТОЧКУ
              </button>
            )}
          </div>

          {/* Форма карточки */}
          {isCardFormOpen && (
            <div className="card" style={{ maxWidth: '100%', marginBottom: '30px', border: '2px solid #18ff62', background: 'rgba(24, 255, 98, 0.05)' }}>
              <h3>{editingCardId ? 'РЕДАКТИРОВАНИЕ КАРТОЧКИ' : 'НОВАЯ КАРТОЧКА МЕХАНИКИ'}</h3>
              <form onSubmit={handleCardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>ЗАГОЛОВОК КАРТОЧКИ:</label>
                <input 
                  type="text" 
                  value={cardFormData.title} 
                  onChange={(e) => setCardFormData({...cardFormData, title: e.target.value})} 
                  required 
                  style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} 
                />
                <label>СОДЕРЖИМОЕ (HTML):</label>
                <textarea 
                  value={cardFormData.content} 
                  onChange={(e) => setCardFormData({...cardFormData, content: e.target.value})} 
                  required 
                  style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '150px', fontFamily: 'monospace' }} 
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn" style={{ background: '#18ff62', color: 'black', flex: 1 }}>СОХРАНИТЬ КАРТОЧКУ</button>
                  <button type="button" className="btn" onClick={() => setIsCardFormOpen(false)} style={{ flex: 1 }}>ОТМЕНА</button>
                </div>
              </form>
            </div>
          )}

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', alignItems: 'start' }}>
            {(currentMechanic.cards || []).map(card => (
              <div key={card.id} className="card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ color: 'yellow', marginTop: 0, borderBottom: '1px solid #18ff62', paddingBottom: '5px' }}>{card.title}</h3>
                  {isLoggedIn && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn" style={{ fontSize: '0.6em', padding: '2px 5px' }} onClick={() => handleCardEdit(card)}>ИЗМ</button>
                      <button className="btn" style={{ fontSize: '0.6em', padding: '2px 5px', color: 'red' }} onClick={() => handleCardDelete(card.id)}>УДЛ</button>
                    </div>
                  )}
                </div>
                <div 
                  className="mechanic-card-content" 
                  style={{ lineHeight: '1.4' }}
                  dangerouslySetInnerHTML={{ __html: card.content }} 
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Разделы механик еще не созданы.</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontStyle: 'italic', color: '#888' }}>
        * Для получения полной информации обратитесь к руководству мастера или полному PDF-файлу правил.
      </div>
    </div>
  );
};

export default Mechanics;
