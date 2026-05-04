import React, { useState, useEffect } from 'react';
import { getOrigins, deleteOrigin, createOrigin, updateOrigin } from '../api';
import { useAuth } from '../api/AuthContext';

interface Origin {
  id: number;
  name: string;
  description: string;
  bonus: string;
  image?: string;
  fullImage?: string;
}

const Origins: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
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

  const fetchOrigins = () => {
    setLoading(true);
    getOrigins()
      .then(res => {
        setOrigins(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrigins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const originData = {
        ...formData,
        image: formData.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg',
        fullImage: formData.fullImage || formData.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg'
      };

      if (editingId) {
        const res = await updateOrigin(editingId, originData);
        setOrigins(origins.map(o => o.id === editingId ? res.data : o));
        if (selectedOrigin?.id === editingId) setSelectedOrigin(res.data);
      } else {
        const res = await createOrigin(originData);
        setOrigins([...origins, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении происхождения');
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

  const handleEdit = (origin: Origin) => {
    setEditingId(origin.id);
    setFormData({
      name: origin.name,
      description: origin.description,
      bonus: origin.bonus,
      image: origin.image || '',
      fullImage: origin.fullImage || ''
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Удалить это происхождение?')) {
      try {
        await deleteOrigin(id);
        setOrigins(origins.filter(o => o.id !== id));
        if (selectedOrigin?.id === id) setSelectedOrigin(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Загрузка данных из терминала...</div>;

  if (selectedOrigin) {
    return (
      <div className="origin-detail">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn" onClick={() => { setSelectedOrigin(null); resetForm(); }}>← НАЗАД К СПИСКУ</button>
          {isLoggedIn && !isFormOpen && (
            <button className="btn" style={{ color: 'yellow' }} onClick={() => handleEdit(selectedOrigin)}>
              РЕДАКТИРОВАТЬ ЭТО ПРОИСХОЖДЕНИЕ
            </button>
          )}
        </div>

        {isFormOpen ? (
          <div className="card" style={{ maxWidth: '100%', marginTop: '20px', border: '2px solid yellow' }}>
            <h3>РЕДАКТИРОВАНИЕ: {selectedOrigin.name}</h3>
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
            <h1>{selectedOrigin.name}</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <div className="terminal-image-container">
                  <img src={selectedOrigin.fullImage || selectedOrigin.image} alt={selectedOrigin.name} style={{ width: '100%', border: '2px solid #18ff62' }} />
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ padding: '20px', background: 'rgba(0, 68, 0, 0.4)', border: '1px solid #18ff62' }}>
                  <h3 style={{ color: 'yellow', marginTop: 0 }}>Бонусы происхождения:</h3>
                  <p style={{ fontSize: '1.2em', color: '#18ff62' }}>{selectedOrigin.bonus}</p>
                  <hr style={{ borderColor: '#18ff62', margin: '20px 0' }} />
                  <h3 style={{ color: 'yellow' }}>Описание и история:</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedOrigin.description}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="origins-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Происхождения</h1>
        {isLoggedIn && (
          <button className="btn" style={{ color: 'yellow' }} onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}>
            {isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ ПРОИСХОЖДЕНИЕ'}
          </button>
        )}
      </div>

      {isFormOpen && !editingId && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '30px', border: '2px solid yellow' }}>
          <h3>ДОБАВЛЕНИЕ НОВОГО ПРОИСХОЖДЕНИЯ</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>НАЗВАНИЕ:</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            <label>БОНУС:</label>
            <input type="text" value={formData.bonus} onChange={(e) => setFormData({...formData, bonus: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            <label>ОПИСАНИЕ:</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '80px' }} />
            <label>URL КАРТИНКИ КАРТОЧКИ:</label>
            <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black', marginTop: '10px' }}>СОЗДАТЬ ПРОИСХОЖДЕНИЕ</button>
          </form>
        </div>
      )}
      
      <div className="card-grid">
        {origins.map(origin => (
          <div key={origin.id} className="card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedOrigin(origin)}>
            <div style={{ position: 'relative' }}>
              <img src={origin.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg'} alt={origin.name} style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid #18ff62' }} />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: 'rgba(0,0,0,0.8)', 
                padding: '10px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: 0, border: 'none' }}>{origin.name}</h3>
              </div>
              {isLoggedIn && (
                <button 
                  className="btn" 
                  style={{ position: 'absolute', top: 5, right: 5, color: 'red', fontSize: '0.6em', padding: '2px 5px' }}
                  onClick={(e) => handleDelete(e, origin.id)}
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

export default Origins;
