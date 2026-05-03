import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <p>© {new Date().getFullYear()} Vault-Tec Industries. Все права принадлежат Bethesda Softworks.</p>
          <p>Разработано для фанатов Fallout и D&D.</p>
        </div>
        <div>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '0.8em' }}>Медиа</a>
          <a href="https://www.youtube.com/shorts/Qta9chteIug" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '0.8em' }}>Техподдержка</a>
        </div>
        <div>
          <p>Контактная информация: vault-tec@wasteland.com</p>
          <p>Дата создания: 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
