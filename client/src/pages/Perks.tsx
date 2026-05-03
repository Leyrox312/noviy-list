import React, { useState, useEffect } from 'react';
import { getPerks, deletePerk, createPerk, updatePerk } from '../api';
import { useAuth } from '../api/AuthContext';

const Perks: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [perks, setPerks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', requirement: '', image: '' });

  const fetchPerks = () => {
    setLoading(true);
    getPerks().then(res => {
      setPerks(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchPerks(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updatePerk(editingId, formData);
        setPerks(perks.map(p => p.id === editingId ? res.data : p));
      } else {
        const res = await createPerk(formData);
        setPerks([...perks, res.data]);
      }
      resetForm();
    } catch (err) { alert('Ошибка'); }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', description: '', requirement: '', image: '' });
  };

  const handleEdit = (perk: any) => {
    setEditingId(perk.id);
    setFormData({ name: perk.name, description: perk.description, requirement: perk.requirement, image: perk.image || '' });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить?')) {
      await deletePerk(id);
      setPerks(perks.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="terminal-container"><h1>ЗАГРУЗКА...</h1></div>;

  return (
    <div className="perks-page">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>ПЕРКИ</h1>
        {isLoggedIn && <button className="btn" onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ'}</button>}
      </div>

      {isFormOpen && (
        <div className="card" style={{ border: '2px solid yellow', marginBottom: '20px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Название" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <textarea placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black', minHeight: '100px' }} />
            <input type="text" placeholder="Требования" value={formData.requirement} onChange={e => setFormData({...formData, requirement: e.target.value})} className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black' }}>СОХРАНИТЬ</button>
          </form>
        </div>
      )}

      <div className="card-grid">
        {perks.map(perk => (
          <div key={perk.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'yellow' }}>{perk.name}</h3>
              {isLoggedIn && (
                <div>
                  <button className="btn" style={{ fontSize: '0.6em' }} onClick={() => handleEdit(perk)}>ИЗМ</button>
                  <button className="btn" style={{ fontSize: '0.6em', color: 'red' }} onClick={() => handleDelete(perk.id)}>УДЛ</button>
                </div>
              )}
            </div>
            <p><strong>Требование:</strong> {perk.requirement}</p>
            <p>{perk.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Perks;
