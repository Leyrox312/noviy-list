import React, { useState, useEffect } from 'react';
import { getItems, deleteItem, createItem, updateItem } from '../api';
import { useAuth } from '../api/AuthContext';

const Armor: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('Все');
  const [loading, setLoading] = useState(true);
  
  // Состояние для формы добавления/редактирования
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    subType: 'Легкая',
    price: 0,
    stats: '',
    description: ''
  });

  const fetchArmor = () => {
    setLoading(true);
    getItems().then(res => {
      setItems(res.data.filter((i: any) => i.type === 'Armor'));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchArmor();
  }, []);

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
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении брони');
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      subType: 'Легкая',
      price: 0,
      stats: '',
      description: 'Защитное снаряжение из Пустоши'
    });
  };

  const handleEdit = (armor: any) => {
    setEditingId(armor.id);
    setFormData({
      name: armor.name,
      subType: armor.subType || 'Легкая',
      price: armor.price,
      stats: armor.stats,
      description: armor.description
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить эту броню?')) {
      try {
        await deleteItem(id);
        setItems(items.filter(i => i.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const types = ['Все', 'Легкая', 'Средняя', 'Тяжелая', 'Силовая', 'Одежда'];

  const filteredArmor = selectedType === 'Все' 
    ? items 
    : items.filter(i => i.subType === selectedType);

  if (loading) return <div>Загрузка данных из терминала...</div>;

  return (
    <div className="armor-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Броневая</h1>
        {isLoggedIn && (
          <button className="btn" style={{ color: 'yellow' }} onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}>
            {isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ БРОНЮ'}
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '30px', border: '2px solid yellow' }}>
          <h3>{editingId ? 'РЕДАКТИРОВАНИЕ БРОНИ' : 'НОВАЯ БРОНЯ В СКЛАД'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>НАЗВАНИЕ:</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} 
            />
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>ТИП:</label>
                <select 
                  value={formData.subType} 
                  onChange={(e) => setFormData({...formData, subType: e.target.value})} 
                  style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', width: '100%' }}
                >
                  {types.filter(t => t !== 'Все').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>ЦЕНА (крышки):</label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} 
                  required 
                  style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', width: '100%' }} 
                />
              </div>
            </div>

            <label>ХАРАКТЕРИСТИКИ (КБ, сопротивление, вес):</label>
            <textarea 
              value={formData.stats} 
              onChange={(e) => setFormData({...formData, stats: e.target.value})} 
              required 
              placeholder="Пример: КБ 15, Вес 12, +1 к СИЛ..." 
              style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '60px' }} 
            />

            <label>ОПИСАНИЕ / ЛОР:</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
              style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '60px' }} 
            />

            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black' }}>
              {editingId ? 'ОБНОВИТЬ В БАЗЕ ДАННЫХ' : 'СОХРАНИТЬ В СКЛАД'}
            </button>
          </form>
        </div>
      )}
      
      <div className="category-buttons" style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {types.map(type => (
          <button 
            key={type} 
            className="btn" 
            style={{ 
              background: selectedType === type ? '#18ff62' : '#004400',
              color: selectedType === type ? 'black' : '#18ff62'
            }}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filteredArmor.map(armor => (
          <div key={armor.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'yellow' }}>{armor.name}</h3>
              {isLoggedIn && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    className="btn" 
                    style={{ color: '#18ff62', fontSize: '0.6em', padding: '2px 8px' }}
                    onClick={() => handleEdit(armor)}
                  >
                    ИЗМ
                  </button>
                  <button 
                    className="btn" 
                    style={{ color: 'red', fontSize: '0.6em', padding: '2px 8px' }}
                    onClick={() => handleDelete(armor.id)}
                  >
                    УДЛ
                  </button>
                </div>
              )}
            </div>
            <p><strong>Тип:</strong> {armor.subType || 'Легкая'}</p>
            <p><strong>Цена:</strong> {armor.price} крышек</p>
            <div style={{ margin: '10px 0', fontStyle: 'italic', fontSize: '0.9em' }}>
              {armor.description}
            </div>
            <div style={{ borderTop: '1px solid #18ff62', marginTop: '10px', paddingTop: '10px', background: 'rgba(24, 255, 98, 0.1)', padding: '5px' }}>
              <strong>ТТХ:</strong> {armor.stats}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Armor;
