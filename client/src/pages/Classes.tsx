import React, { useEffect, useState } from 'react';
import { getClasses, deleteClass, createClass, updateClass } from '../api';
import { useAuth } from '../api/AuthContext';

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
  const { isLoggedIn } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Состояние для формы добавления/редактирования
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    fullImage: '',
    levels: [] as ClassLevel[]
  });

  const fetchClasses = () => {
    setLoading(true);
    getClasses()
      .then(res => {
        setClasses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const classData = {
        ...formData,
        image: formData.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg',
        fullImage: formData.fullImage || formData.image || 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg',
        levels: formData.levels.length > 0 ? formData.levels : [
          { level: 1, perk: 'Начальный перк', bonus: '+1 к стате' }
        ]
      };

      if (editingId) {
        const res = await updateClass(editingId, classData);
        setClasses(classes.map(c => c.id === editingId ? res.data : c));
        if (selectedClass?.id === editingId) setSelectedClass(res.data);
      } else {
        const res = await createClass(classData);
        setClasses([...classes, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении класса');
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      fullImage: '',
      levels: []
    });
  };

  const handleEdit = (cls: Class) => {
    setEditingId(cls.id);
    setFormData({
      name: cls.name,
      description: cls.description,
      image: cls.image,
      fullImage: cls.fullImage,
      levels: cls.levels
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Удалить этот класс?')) {
      try {
        await deleteClass(id);
        setClasses(classes.filter(c => c.id !== id));
        if (selectedClass?.id === id) setSelectedClass(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLevelChange = (index: number, field: keyof ClassLevel, value: string | number) => {
    const newLevels = [...formData.levels];
    newLevels[index] = { ...newLevels[index], [field]: field === 'level' ? parseInt(value as string) : value };
    setFormData({ ...formData, levels: newLevels });
  };

  const addLevel = () => {
    setFormData({
      ...formData,
      levels: [...formData.levels, { level: formData.levels.length + 1, perk: '', bonus: '' }]
    });
  };

  if (loading) return <div>Загрузка данных из терминала...</div>;

  if (selectedClass) {
    return (
      <div className="class-detail">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn" onClick={() => { setSelectedClass(null); resetForm(); }}>← НАЗАД К СПИСКУ</button>
          {isLoggedIn && !isFormOpen && (
            <button className="btn" style={{ color: 'yellow' }} onClick={() => handleEdit(selectedClass)}>
              РЕДАКТИРОВАТЬ ЭТОТ КЛАСС
            </button>
          )}
        </div>

        {isFormOpen ? (
          <div className="card" style={{ maxWidth: '100%', marginTop: '20px', border: '2px solid yellow' }}>
            <h3>РЕДАКТИРОВАНИЕ: {selectedClass.name}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>НАЗВАНИЕ:</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
              <label>ОПИСАНИЕ:</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '80px' }} />
              <label>URL КАРТИНКИ КАРТОЧКИ:</label>
              <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
              <label>URL КАРТИНКИ ОПИСАНИЯ:</label>
              <input type="text" value={formData.fullImage} onChange={(e) => setFormData({...formData, fullImage: e.target.value})} style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
              
              <h4>Прогрессия уровней:</h4>
              {formData.levels.map((level, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                  <input type="number" value={level.level} onChange={(e) => handleLevelChange(idx, 'level', e.target.value)} placeholder="Ур" style={{ width: '50px', background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '5px' }} />
                  <input type="text" value={level.perk} onChange={(e) => handleLevelChange(idx, 'perk', e.target.value)} placeholder="Название перка" style={{ flex: 2, background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '5px' }} />
                  <input type="text" value={level.bonus} onChange={(e) => handleLevelChange(idx, 'bonus', e.target.value)} placeholder="Бонус" style={{ flex: 1, background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '5px' }} />
                </div>
              ))}
              <button type="button" className="btn" onClick={addLevel} style={{ alignSelf: 'flex-start', fontSize: '0.8em' }}>+ ДОБАВИТЬ УРОВЕНЬ</button>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn" style={{ background: 'yellow', color: 'black', flex: 1 }}>СОХРАНИТЬ ИЗМЕНЕНИЯ</button>
                <button type="button" className="btn" onClick={() => setIsFormOpen(false)} style={{ flex: 1 }}>ОТМЕНА</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <h1>{selectedClass.name}</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <div className="terminal-image-container">
                  <img src={selectedClass.fullImage} alt={selectedClass.name} style={{ width: '100%', border: '2px solid #18ff62' }} />
                  <div style={{ padding: '10px', background: 'rgba(0, 68, 0, 0.8)', border: '1px solid #18ff62', marginTop: '10px' }}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedClass.description}</p>
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
          </>
        )}
      </div>
    );
  }

  return (
    <div className="classes-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Классы персонажей</h1>
        {isLoggedIn && (
          <button className="btn" style={{ color: 'yellow' }} onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}>
            {isFormOpen ? 'ОТМЕНА' : '+ ДОБАВИТЬ КЛАСС'}
          </button>
        )}
      </div>

      {isFormOpen && !editingId && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '30px', border: '2px solid yellow' }}>
          <h3>ДОБАВЛЕНИЕ НОВОГО КЛАССА</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>НАЗВАНИЕ:</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            <label>ОПИСАНИЕ:</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '80px' }} />
            <label>URL КАРТИНКИ КАРТОЧКИ:</label>
            <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} />
            
            <button type="submit" className="btn" style={{ background: 'yellow', color: 'black', marginTop: '10px' }}>СОЗДАТЬ КЛАСС</button>
          </form>
        </div>
      )}
      
      <div className="card-grid">
        {classes.map(cls => (
          <div key={cls.id} className="card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedClass(cls)}>
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
              {isLoggedIn && (
                <button 
                  className="btn" 
                  style={{ position: 'absolute', top: 5, right: 5, color: 'red', fontSize: '0.6em', padding: '2px 5px' }}
                  onClick={(e) => handleDelete(e, cls.id)}
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

export default Classes;
