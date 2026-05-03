import React, { useEffect, useState } from 'react';
import { getRaces } from '../api';

interface Race {
  id: number;
  name: string;
  description: string;
  bonus: string;
  image?: string;
}

const Races: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
      <h1>Расы Пустоши</h1>
      
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
            <h3>{race.name}</h3>
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
