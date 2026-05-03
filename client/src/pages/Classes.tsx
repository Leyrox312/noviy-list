import React, { useEffect, useState } from 'react';
import { getClasses } from '../api';

interface ClassLevel {
  level: number;
  perk: string;
  bonus: string;
}

interface Class {
  id: number;
  name: string;
  description: string;
  image: string;
  fullImage: string;
  levels: ClassLevel[];
}

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClasses()
      .then(res => {
        setClasses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка данных из терминала...</div>;

  if (selectedClass) {
    return (
      <div className="class-detail">
        <button className="btn" onClick={() => setSelectedClass(null)}>← НАЗАД К СПИСКУ</button>
        <h1>{selectedClass.name}</h1>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          <div style={{ flex: 1 }}>
             {/* TZ: "описание, оно сделано цельной картинкой" */}
            <div className="terminal-image-container">
              <img src={selectedClass.fullImage} alt={selectedClass.name} style={{ width: '100%', border: '2px solid #18ff62' }} />
              <div style={{ padding: '10px', background: 'rgba(0, 68, 0, 0.8)', border: '1px solid #18ff62', marginTop: '10px' }}>
                <p>{selectedClass.description}</p>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <h3>Прогресс по уровням</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #18ff62' }}>
              <thead>
                <tr style={{ background: '#004400' }}>
                  <th style={{ border: '1px solid #18ff62', padding: '10px' }}>УРОВЕНЬ</th>
                  <th style={{ border: '1px solid #18ff62', padding: '10px' }}>ПЕРК</th>
                  <th style={{ border: '1px solid #18ff62', padding: '10px' }}>БОНУС</th>
                </tr>
              </thead>
              <tbody>
                {selectedClass.levels.map(l => (
                  <tr key={l.level}>
                    <td style={{ border: '1px solid #18ff62', padding: '10px', textAlign: 'center' }}>{l.level}</td>
                    <td style={{ border: '1px solid #18ff62', padding: '10px' }}>{l.perk}</td>
                    <td style={{ border: '1px solid #18ff62', padding: '10px' }}>{l.bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="classes-page">
      <h1>Классы персонажей</h1>
      <p style={{ marginBottom: '20px' }}>Выберите вашу специализацию в этом суровом мире.</p>
      
      <div className="card-grid">
        {classes.map(cls => (
          <div key={cls.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedClass(cls)}>
            <div style={{ position: 'relative' }}>
              <img src={cls.image} alt={cls.name} style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid #18ff62' }} />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: 'rgba(0,0,0,0.8)', 
                padding: '10px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: 0, border: 'none' }}>{cls.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
