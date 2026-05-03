import React from 'react';

const QuickStart: React.FC = () => {
  return (
    <div className="quick-start-page">
      <h1>Быстрый старт</h1>
      
      <section>
        <h2>Как этим вообще пользоваться?</h2>
        <p>
          Данная книга правил является дополнением и адаптацией DND 5 редакции под сеттинг Fallout. 
          Если вы никогда не играли в D&D или не вели партии, мы настоятельно рекомендуем сначала 
          ознакомиться с базовыми правилами Player's Handbook D&D 5e.
        </p>
        <button className="btn" onClick={() => window.open('https://dnd.wizards.com/what-is-dnd/basic-rules', '_blank')}>
          Книга игрока D&D 5e
        </button>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Алгоритм создания персонажа</h2>
        <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '15px' }}>
            Выберите расу персонажа 
            <button className="btn" style={{ marginLeft: '10px' }} onClick={() => window.location.href='/races'}>Перейти</button>
          </li>
          <li style={{ marginBottom: '15px' }}>
            Выберите класс персонажа
            <button className="btn" style={{ marginLeft: '10px' }} onClick={() => window.location.href='/classes'}>Перейти</button>
          </li>
          <li style={{ marginBottom: '15px' }}>
            Определите характеристики (S.P.E.C.I.A.L.)
            <button className="btn" style={{ marginLeft: '10px' }}>Инфо</button>
          </li>
          <li style={{ marginBottom: '15px' }}>
            Выберите происхождение
            <button className="btn" style={{ marginLeft: '10px' }} onClick={() => window.location.href='/origins'}>Перейти</button>
          </li>
          <li style={{ marginBottom: '15px' }}>
            Выберите начальное снаряжение
            <button className="btn" style={{ marginLeft: '10px' }} onClick={() => window.location.href='/weapons'}>Перейти</button>
          </li>
          <li style={{ marginBottom: '15px' }}>
            Выберите перки (если доступны)
            <button className="btn" style={{ marginLeft: '10px' }} onClick={() => window.location.href='/perks'}>Перейти</button>
          </li>
          <li style={{ marginBottom: '15px' }}>
            Запишите предысторию и детали
            <button className="btn" style={{ marginLeft: '10px' }}>Инфо</button>
          </li>
        </ol>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Вопросы и помощь</h2>
        <p>Если у вас возникли вопросы по системе, вы можете связаться с создателем проекта или обратиться к официальной википедии.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn" onClick={() => document.getElementById('footer')?.scrollIntoView()}>Методы связи</button>
          <button className="btn" onClick={() => window.open('https://fallout.fandom.com/ru/wiki/%D0%A3%D0%B1%D0%B5%D0%B6%D0%B8%D1%89%D0%B5', '_blank')}>
            Убежище Wiki
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuickStart;
