import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Добро пожаловать в Пустошь</h1>
      <div style={{ maxWidth: '800px', lineHeight: '1.6' }}>
        <p>
          Это официальный справочник по системе Fallout D&D. Здесь вы найдете все необходимые правила, 
          описания рас, классов и предметов для проведения ваших приключений в мире после ядерной войны.
        </p>
        <p>
          Система объединяет глубину механик D&D 5-й редакции с неповторимой атмосферой вселенной Fallout.
        </p>
        <button className="btn" style={{ fontSize: '1.2em', padding: '15px 30px' }} onClick={() => navigate('/quick-start')}>
          Начать приключение (Быстрый старт)
        </button>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>О проекте</h2>
        <p>
          Проект создан для автоматизации и упрощения доступа к правилам игры. Администраторы могут 
          редактировать статьи, добавлять новые расы и предметы через панель управления.
        </p>
      </div>
    </div>
  );
};

export default Home;
