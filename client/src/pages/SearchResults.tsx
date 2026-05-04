import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getRaces, getClasses, getItems, getArticles, getPerks, getOrigins } from '../api';

const SearchResults: React.FC = () => {
  const [results, setSearchResults] = useState<{ type: string; name: string; link: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [races, classes, items, articles, perks, origins] = await Promise.all([
          getRaces(),
          getClasses(),
          getItems(),
          getArticles(),
          getPerks(),
          getOrigins()
        ]);

        const allResults = [
          ...races.data.map((r: any) => ({ type: 'Раса', name: r.name, link: '/races' })),
          ...classes.data.map((c: any) => ({ type: 'Класс', name: c.name, link: '/classes' })),
          ...items.data.map((i: any) => ({ 
            type: i.type === 'Weapon' ? 'Оружие' : (i.type === 'Armor' ? 'Броня' : 'Предмет'), 
            name: i.name, 
            link: i.type === 'Weapon' ? '/weapons' : (i.type === 'Armor' ? '/armor' : '/items'),
            subType: i.subType
          })),
          ...articles.data.map((a: any) => ({ type: 'Статья', name: a.title, link: `/articles/${a.id}` })),
          ...(perks?.data || []).map((p: any) => ({ type: 'Перк', name: p.name, link: '/perks' })),
          ...(origins?.data || []).map((o: any) => ({ type: 'Происхождение', name: o.name, link: '/origins' }))
        ];

        const filtered = allResults.filter(item => 
          item.name.toLowerCase().includes(query)
        );

        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchData();
  }, [query]);

  return (
    <div className="search-results">
      <h1>РЕЗУЛЬТАТЫ ПОИСКА: "{query.toUpperCase()}"</h1>
      {loading ? (
        <p>СКАНИРОВАНИЕ БАЗЫ ДАННЫХ...</p>
      ) : results.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map((res, idx) => (
            <li key={idx} style={{ marginBottom: '15px', borderBottom: '1px solid #18ff62', paddingBottom: '10px' }}>
              <span style={{ color: 'yellow' }}>[{res.type.toUpperCase()}]</span>{' '}
              {res.subType && <span style={{ color: '#888', fontSize: '0.8em', marginRight: '10px' }}>({res.subType})</span>}
              <Link to={res.link} style={{ color: '#18ff62', fontSize: '1.2em' }}>{res.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>СОВПАДЕНИЙ НЕ ОБНАРУЖЕНО.</p>
      )}
    </div>
  );
};

export default SearchResults;
