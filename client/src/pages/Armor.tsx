import React, { useState, useEffect } from 'react';
import { getItems, deleteItem, createItem, updateItem } from '../api';
import { useAuth } from '../api/AuthContext';

const Armor: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, stats: '', description: '' });

  const fetchArmor = () => {
    setLoading(true);
    getItems().then(res => {
      setItems(res.data.filter((i: any) => i.type === 'Armor'));
      setLoading(false);
    });
  };

  useEffect(() => { fetchArmor(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updateItem(editingId, { ...formData, type: 'Armor' });
        setItems(items.map(i => i.id === editingId ? res.data : i));
      } else {
        const res = await createItem({ ...formData, type: 'Armor' });
        setItems([...items, res.data]);
      }
      resetForm();
    } catch (err) { alert('Ошибка'); }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', price: 0, stats: '', description: '' });
  };

  const handleEdit = (armor: any) => {
    setEditingId(armor.id);
    setFormData({ name: armor.name, price: armor.price, stats: armor.stats, description: armor.description });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить?')) {
      await deleteItem(id);
      setItems(items.filter(i => i.id !== id));
    }
  };

  if (loading) return <div className="terminal-container"><h1>ЗАГРУЗКА...</h1></div>;

  return (
    <div className="armor-page">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>БРОНЯ</h1>
        {isLoggedIn && <button className="btn" onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ'}</button>}
      </div>

      {isFormOpen && (
        <div className="card" style={{ border: '2px solid yellow', marginBottom: '20px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Название" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <input type="number" placeholder="Цена" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <input type="text" placeholder="Класс брони / Вес" value={formData.stats} onChange={e => setFormData({...formData, stats: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <textarea placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black' }}>СОХРАНИТЬ</button>
          </form>
        </div>
      )}

      <div className="card-grid">
        {items.map(armor => (
          <div key={armor.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'yellow' }}>{armor.name}</h3>
              {isLoggedIn && (
                <div>
                  <button className="btn" style={{ fontSize: '0.6em' }} onClick={() => handleEdit(armor)}>ИЗМ</button>
                  <button className="btn" style={{ fontSize: '0.6em', color: 'red' }} onClick={() => handleDelete(armor.id)}>УДЛ</button>
                </div>
              )}
            </div>
            <p><strong>Цена:</strong> {armor.price} крышек</p>
            <p><strong>ТТХ:</strong> {armor.stats}</p>
            <p>{armor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Armor;
