import React, { useState, useEffect } from 'react';
import { getArticles, getRaces, login } from '../api';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.data.token) {
        setIsLoggedIn(true);
        fetchData();
      }
    } catch (err) {
      setError('Ошибка доступа: Неверные учетные данные');
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
          {loading ? <p>Синхронизация...</p> : (
            <ul>
              {articles.map(a => (
                <li key={a.id} style={{ marginBottom: '10px', listStyle: 'none', borderBottom: '1px solid #18ff62' }}>
                  {a.title} 
                  <button className="btn" style={{ fontSize: '0.6em', padding: '2px 5px' }}>Изм</button>
                  <button className="btn" style={{ fontSize: '0.6em', padding: '2px 5px', color: 'red' }}>Удл</button>
                </li>
              ))}
            </ul>
          )}
          <button className="btn">+ Добавить статью</button>
        </div>
        
        <div style={{ flex: 1 }}>
          <h2>Другие данные</h2>
          <p>Управление расами, классами и предметами доступно в соответствующих модулях.</p>
          <button className="btn" onClick={() => window.location.href='/races'}>К расам</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
