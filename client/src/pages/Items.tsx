import React, { useState, useEffect } from 'react';
import { getItems, deleteItem, createItem, updateItem } from '../api';
import { useAuth } from '../api/AuthContext';

const Items: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, stats: '', description: '', type: 'Meds' });

  const fetchItems = () => {
    setLoading(true);
    getItems().then(res => {
      // Фильтруем все, что не оружие и не броня
      setItems(res.data.filter((i: any) => i.type !== 'Weapon' && i.type !== 'Armor'));
      setLoading(false);
    });
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updateItem(editingId, formData);
        setItems(items.map(i => i.id === editingId ? res.data : i));
      } else {
        const res = await createItem(formData);
        setItems([...items, res.data]);
      }
      resetForm();
    } catch (err) { alert('Ошибка'); }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', price: 0, stats: '', description: '', type: 'Meds' });
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ name: item.name, price: item.price, stats: item.stats, description: item.description, type: item.type });
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
    <div className="items-page">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>ПРЕДМЕТЫ И ПРОВИЗИЯ</h1>
        {isLoggedIn && <button className="btn" onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ'}</button>}
      </div>

      {isFormOpen && (
        <div className="card" style={{ border: '2px solid yellow', marginBottom: '20px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Название" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="btn" style={{ background: 'black' }}>
              <option value="Meds">Медикаменты</option>
              <option value="Food">Еда / Напитки</option>
              <option value="Tool">Инструменты</option>
              <option value="Ammo">Аммуниция</option>
            </select>
            <input type="number" placeholder="Цена" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <input type="text" placeholder="Эффект / Вес" value={formData.stats} onChange={e => setFormData({...formData, stats: e.target.value})} required className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <textarea placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="btn" style={{ textAlign: 'left', background: 'black' }} />
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black' }}>СОХРАНИТЬ</button>
          </form>
        </div>
      )}

      <div className="card-grid">
        {items.map(item => (
          <div key={item.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'yellow' }}>{item.name} <span style={{ fontSize: '0.6em', color: '#18ff62' }}>[{item.type}]</span></h3>
              {isLoggedIn && (
                <div>
                  <button className="btn" style={{ fontSize: '0.6em' }} onClick={() => handleEdit(item)}>ИЗМ</button>
                  <button className="btn" style={{ fontSize: '0.6em', color: 'red' }} onClick={() => handleDelete(item.id)}>УДЛ</button>
                </div>
              )}
            </div>
            <p><strong>Цена:</strong> {item.price} крышек</p>
            <p><strong>Эффект:</strong> {item.stats}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
