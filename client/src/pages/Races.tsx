import React, { useEffect, useState } from 'react';
import { getRaces, deleteRace, createRace } from '../api';
import { useAuth } from '../api/AuthContext';

interface Race {
  id: number;
  name: string;
  description: string;
  bonus: string;
  image?: string;
}

const Races: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [races, setRaces] = useState<Race[]>([]);
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Состояние для формы добавления
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBonus, setNewBonus] = useState('');

  const fetchRaces = () => {
    setLoading(true);
    getRaces()
      .then(res => {
        setRaces(res.data);
        setFilteredRaces(res.data);
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

  const handleAddRace = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending data:', { name: newName, description: newDesc, bonus: newBonus });
    try {
      const res = await createRace({
        name: newName,
        description: newDesc,
        bonus: newBonus
      });
      console.log('Response from server:', res.data);
      setRaces([...races, res.data]);
      setIsAdding(false);
      setNewName('');
      setNewDesc('');
      setNewBonus('');
    } catch (err: any) {
      console.error('Full error object:', err);
      const errorMsg = err.response?.data?.details || err.message || 'Неизвестная ошибка';
      alert(`Ошибка при создании расы: ${errorMsg}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить расу из базы данных?')) {
      try {
        await deleteRace(id);
        setRaces(races.filter(r => r.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const results = races.filter(race =>
      race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      race.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRaces(results);
  }, [searchTerm, races]);

  if (loading) return <div>Загрузка данных из терминала...</div>;

  return (
    <div className="races-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Расы Пустоши</h1>
        {isLoggedIn && (
          <button 
            className="btn" 
            style={{ color: 'yellow' }}
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? 'ОТМЕНА' : '+ ДОБАВИТЬ РАСУ'}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '30px', border: '2px solid yellow' }}>
          <h3>ДОБАВЛЕНИЕ НОВОЙ РАСЫ</h3>
          <form onSubmit={handleAddRace} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>НАЗВАНИЕ:</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              required
              style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }}
            />
            <label>ОПИСАНИЕ:</label>
            <textarea 
              value={newDesc} 
              onChange={(e) => setNewDesc(e.target.value)}
              required
              style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '80px' }}
            />
            <label>РАСОВЫЙ БОНУС:</label>
            <input 
              type="text" 
              value={newBonus} 
              onChange={(e) => setNewBonus(e.target.value)}
              required
              placeholder="+2 Сила и т.д."
              style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }}
            />
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black' }}>СОХРАНИТЬ В БАЗУ ДАННЫХ</button>
          </form>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label>ПОИСК ПО БАЗЕ ДАННЫХ: </label>
        <input 
          type="text" 
          placeholder="Введите название или описание..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            background: 'black', 
            color: '#18ff62', 
            border: '1px solid #18ff62', 
            padding: '10px', 
            width: '100%',
            maxWidth: '400px',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div className="card-grid">
        {filteredRaces.map(race => (
          <div key={race.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{race.name}</h3>
              {isLoggedIn && (
                <button 
                  className="btn" 
                  style={{ color: 'red', fontSize: '0.7em', padding: '2px 5px' }}
                  onClick={() => handleDelete(race.id)}
                >
                  УДАЛИТЬ
                </button>
              )}
            </div>
            {race.image && <img src={race.image} alt={race.name} style={{ width: '100%', marginBottom: '10px' }} />}
            <p><strong>Описание:</strong> {race.description}</p>
            <p><strong>Бонусы:</strong> {race.bonus}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Races;
