import React, { useState, useEffect } from 'react';
import { getArticles, deleteArticle, createArticle, updateArticle, login } from '../api';
import { useAuth } from '../api/AuthContext';

const Admin: React.FC = () => {
  const { isLoggedIn, login: authLogin, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Состояние для формы статьи
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: 1 // По умолчанию "Лор"
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.data.token) {
        authLogin(res.data);
      }
    } catch (err) {
      setError('Ошибка доступа: Неверные учетные данные');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updateArticle(editingId, formData);
        setArticles(articles.map(a => a.id === editingId ? res.data : a));
      } else {
        const res = await createArticle(formData);
        setArticles([...articles, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('ОШИБКА СОХРАНЕНИЯ');
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ title: '', content: '', categoryId: 1 });
  };

  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      content: article.content,
      categoryId: article.categoryId
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('УДАЛИТЬ СТАТЬЮ ИЗ БАЗЫ?')) {
      try {
        await deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes] = await Promise.all([getArticles()]);
      setArticles(artRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <h1>Вход в терминал администратора</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
          <label>ID ПОЛЬЗОВАТЕЛЯ:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '5px', marginBottom: '10px' }}
          />
          <label>ПАРОЛЬ:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '5px', marginBottom: '10px' }}
          />
          <button type="submit" className="btn">АВТОРИЗАЦИЯ</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Панель управления Vault-Tec</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Статьи</h2>
          {isFormOpen ? (
            <div className="card" style={{ border: '2px solid yellow', marginBottom: '20px' }}>
              <h3>{editingId ? 'ПРАВКА СТАТЬИ' : 'НОВАЯ ЗАПИСЬ'}</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>ЗАГОЛОВОК:</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                  style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px' }} 
                />
                <label>ТЕКСТ СТАТЬИ:</label>
                <textarea 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  required 
                  style={{ background: 'black', color: '#18ff62', border: '1px solid #18ff62', padding: '8px', minHeight: '150px' }} 
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn" style={{ background: 'yellow', color: 'black', flex: 1 }}>СОХРАНИТЬ</button>
                  <button type="button" className="btn" onClick={resetForm} style={{ flex: 1 }}>ОТМЕНА</button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {loading ? <p>Синхронизация...</p> : (
                <ul>
                  {articles.map(a => (
                    <li key={a.id} style={{ marginBottom: '10px', listStyle: 'none', borderBottom: '1px solid #18ff62', paddingBottom: '5px' }}>
                      <span style={{ fontSize: '1.1em' }}>{a.title}</span>
                      <div style={{ marginTop: '5px' }}>
                        <button className="btn" style={{ fontSize: '0.6em', padding: '2px 8px' }} onClick={() => handleEdit(a)}>ИЗМ</button>
                        <button 
                          className="btn" 
                          style={{ fontSize: '0.6em', padding: '2px 8px', color: 'red' }}
                          onClick={() => handleDelete(a.id)}
                        >
                          УДЛ
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className="btn" onClick={() => setIsFormOpen(true)}>+ Добавить статью</button>
            </>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h2>Управление сессией</h2>
          <p>Вы авторизованы как администратор.</p>
          <button className="btn" onClick={logout} style={{ color: 'red' }}>ВЫЙТИ ИЗ ТЕРМИНАЛА</button>
          
          <h2 style={{ marginTop: '20px' }}>Другие данные</h2>
          <p>Управление расами, классами и предметами доступно в соответствующих модулях.</p>
          <button className="btn" onClick={() => window.location.href='/races'}>К расам</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
