import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="terminal-container"><h1>ЗАГРУЗКА ДАННЫХ...</h1></div>;
  if (!article) return <div className="terminal-container"><h1>ОШИБКА: СТАТЬЯ НЕ НАЙДЕНА</h1><Link to="/" className="btn">НА ГЛАВНУЮ</Link></div>;

  return (
    <div className="article-detail">
      <Link to="/" className="btn" style={{ marginBottom: '20px' }}>← НАЗАД</Link>
      <h1 style={{ color: 'yellow' }}>{article.title}</h1>
      <div style={{ 
        border: '1px solid #18ff62', 
        padding: '20px', 
        background: 'rgba(24, 255, 98, 0.05)',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap'
      }}>
        {article.content}
      </div>
      <div style={{ marginTop: '20px', fontSize: '0.8em', opacity: 0.7 }}>
        ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: {new Date(article.updatedAt || article.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default ArticleDetail;
