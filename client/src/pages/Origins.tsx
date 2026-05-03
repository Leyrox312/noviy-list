import React, { useState, useEffect } from 'react';
import { getOrigins, deleteOrigin, createOrigin, updateOrigin } from '../api';
import { useAuth } from '../api/AuthContext';

const Origins: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [origins, setOrigins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', bonus: '' });

  const fetchOrigins = () => {
    setLoading(true);
    getOrigins().then(res => {
      setOrigins(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrigins(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updateOrigin(editingId, formData);
        setOrigins(origins.map(o => o.id === editingId ? res.data : o));
      } else {
        const res = await createOrigin(formData);
        setOrigins([...origins, res.data]);
      }
      resetForm();
    } catch (err) { alert('Ошибка'); }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', description: '', bonus: '' });
  };

  const handleEdit = (origin: any) => {
    setEditingId(origin.id);
    setFormData({ name: origin.name, description: origin.description, bonus: origin.bonus });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить?')) {
      await deleteOrigin(id);
      setOrigins(origins.filter(o => o.id !== id));
    }
  };

  if (loading) return <div className="terminal-container"><h1>ЗАГРУЗКА...</h1></div>;

  return (
    <div className="origins-page">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>ПРОИСХОЖДЕНИЯ</h1>
        {isLoggedIn && <button className="btn" onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ'}</button>}
      </div>

      {isFormOpen && (
        <div className="card" style={{ border: '2px solid yellow', marginBottom: '20px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Название" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <textarea placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black', minHeight: '100px' }} />
            <input type="text" placeholder="Бонус" value={formData.bonus} onChange={e => setFormData({...formData, bonus: e.target.value})} className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black' }}>СОХРАНИТЬ</button>
          </form>
        </div>
      )}

      <div className="card-grid">
        {origins.map(origin => (
          <div key={origin.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'yellow' }}>{origin.name}</h3>
              {isLoggedIn && (
                <div>
                  <button className="btn" style={{ fontSize: '0.6em' }} onClick={() => handleEdit(origin)}>ИЗМ</button>
                  <button className="btn" style={{ fontSize: '0.6em', color: 'red' }} onClick={() => handleDelete(origin.id)}>УДЛ</button>
                </div>
              )}
            </div>
            <p><strong>Бонус:</strong> {origin.bonus}</p>
            <p>{origin.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Origins;
