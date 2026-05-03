import React, { useState, useEffect } from 'react';
import { getItems } from '../api';

const Weapons: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems().then(res => {
      setItems(res.data.filter((i: any) => i.type === 'Weapon'));
      setLoading(false);
    });
  }, []);

  const types = ['All', 'Пистолеты', 'Винтовки', 'Энергетическое', 'Тяжелое'];

  const filteredWeapons = selectedType === 'All' 
    ? items 
    : items.filter(i => i.subType === selectedType);

  if (loading) return <div>Загрузка данных из терминала...</div>;

  return (
    <div className="weapons-page">
      <h1>Оружейная</h1>
      
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
        {filteredWeapons.map(weapon => (
          <div key={weapon.id} className="card">
            <h3>{weapon.name}</h3>
            <p><strong>Цена:</strong> {weapon.price} крышек</p>
            <p><strong>Характеристики:</strong> {weapon.description}</p>
            <div style={{ borderTop: '1px solid #18ff62', marginTop: '10px', paddingTop: '10px', fontSize: '0.9em' }}>
              {weapon.stats}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weapons;
