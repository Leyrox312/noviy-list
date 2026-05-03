import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then(res => {
      setArticles(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="terminal-container"><h1>СКАНИРОВАНИЕ АРХИВОВ...</h1></div>;

  return (
    <div className="articles-page">
      <h1>АРХИВЫ ПУСТОШИ</h1>
      <p style={{ marginBottom: '30px' }}>Здесь собраны все дополнительные материалы, лор и заметки выживших.</p>
      
      <div className="card-grid">
        {articles.map(article => (
          <div key={article.id} className="card">
            <h3 style={{ color: 'yellow' }}>{article.title}</h3>
            <p>{article.content.substring(0, 100)}...</p>
            <Link to={`/articles/${article.id}`} className="btn" style={{ fontSize: '0.8em', marginTop: '10px', display: 'inline-block' }}>
              ЧИТАТЬ ПОЛНОСТЬЮ
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
