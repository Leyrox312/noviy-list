import React, { useEffect, useState } from 'react';
import { getRaces, deleteRace, createRace, updateRace } from '../api';
import { useAuth } from '../api/AuthContext';

interface Race {
  id: number;
  name: string;
  description: string;
  bonus: string;
  image?: string;
  fullImage?: string;
}

const Races: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Состояние для формы добавления/редактирования
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bonus: '',
    image: '',
    fullImage: ''
  });

  const fetchRaces = () => {
    setLoading(true);
    getRaces()
      .then(res => {
        setRaces(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const raceData = {
        ...formData,
        image: formData.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg',
        fullImage: formData.fullImage || formData.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg'
      };

      if (editingId) {
        const res = await updateRace(editingId, raceData);
        setRaces(races.map(r => r.id === editingId ? res.data : r));
        if (selectedRace?.id === editingId) setSelectedRace(res.data);
      } else {
        const res = await createRace(raceData);
        setRaces([...races, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении расы');
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      bonus: '',
      image: '',
      fullImage: ''
    });
  };

  const handleEdit = (race: Race) => {
    setEditingId(race.id);
    setFormData({
      name: race.name,
      description: race.description,
      bonus: race.bonus,
      image: race.image || '',
      fullImage: race.fullImage || ''
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Удалить эту расу?')) {
      try {
        await deleteRace(id);
        setRaces(races.filter(r => r.id !== id));
        if (selectedRace?.id === id) setSelectedRace(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Загрузка данных из терминала...</div>;

  if (selectedRace) {
    return (
      <div className="race-detail">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn" onClick={() => { setSelectedRace(null); resetForm(); }}>← НАЗАД К СПИСКУ</button>
          {isLoggedIn && !isFormOpen && (
            <button className="btn" style={{ color: 'yellow' }} onClick={() => handleEdit(selectedRace)}>
              РЕДАКТИРОВАТЬ ЭТУ РАСУ
            </button>
          )}
        </div>

        {isFormOpen ? (
          <div className="card" style={{ maxWidth: '100%', marginTop: '20px', border: '2px solid yellow' }}>
            <h3>РЕДАКТИРОВАНИЕ: {selectedRace.name}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>НАЗВАНИЕ:</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
              <label>БОНУС:</label>
              <input type="text" value={formData.bonus} onChange={(e) => setFormData({...formData, bonus: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
              <label>ОПИСАНИЕ:</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '120px' }} />
              <label>URL КАРТИНКИ КАРТОЧКИ:</label>
              <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
              <label>URL КАРТИНКИ ОПИСАНИЯ:</label>
              <input type="text" value={formData.fullImage} onChange={(e) => setFormData({...formData, fullImage: e.target.value})} style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn" style={{ background: 'yellow', color: 'black', flex: 1 }}>СОХРАНИТЬ ИЗМЕНЕНИЯ</button>
                <button type="button" className="btn" onClick={() => setIsFormOpen(false)} style={{ flex: 1 }}>ОТМЕНА</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <h1>{selectedRace.name}</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <div className="terminal-image-container">
                  <img src={selectedRace.fullImage || selectedRace.image} alt={selectedRace.name} style={{ width: '100%', border: '2px solid #18ff62' }} />
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ padding: '20px', background: 'rgba(0, 68, 0, 0.4)', border: '1px solid #18ff62' }}>
                  <h3 style={{ color: 'yellow', marginTop: 0 }}>Расовые бонусы:</h3>
                  <p style={{ fontSize: '1.2em', color: '#18ff62' }}>{selectedRace.bonus}</p>
                  <hr style={{ borderColor: '#18ff62', margin: '20px 0' }} />
                  <h3 style={{ color: 'yellow' }}>Описание и биология:</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedRace.description}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="races-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Расы Пустоши</h1>
        {isLoggedIn && (
          <button className="btn" style={{ color: 'yellow' }} onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}>
            {isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ РАСУ'}
          </button>
        )}
      </div>

      {isFormOpen && !editingId && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '30px', border: '2px solid yellow' }}>
          <h3>ДОБАВЛЕНИЕ НОВОЙ РАСЫ</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>НАЗВАНИЕ:</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            <label>БОНУС:</label>
            <input type="text" value={formData.bonus} onChange={(e) => setFormData({...formData, bonus: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            <label>ОПИСАНИЕ:</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '80px' }} />
            <label>URL КАРТИНКИ КАРТОЧКИ:</label>
            <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black', marginTop: '10px' }}>СОЗДАТЬ РАСУ</button>
          </form>
        </div>
      )}
      
      <div className="card-grid">
        {races.map(race => (
          <div key={race.id} className="card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedRace(race)}>
            <div style={{ position: 'relative' }}>
              <img src={race.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg'} alt={race.name} style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid #18ff62' }} />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: 'rgba(0,0,0,0.8)', 
                padding: '10px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: 0, border: 'none' }}>{race.name}</h3>
              </div>
              {isLoggedIn && (
                <button 
                  className="btn" 
                  style={{ position: 'absolute', top: 5, right: 5, color: 'red', fontSize: '0.6em', padding: '2px 5px' }}
                  onClick={(e) => handleDelete(e, race.id)}
                >
                  УДАЛИТЬ
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Races;
