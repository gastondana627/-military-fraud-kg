import { useEffect } from 'react';

export const useCommandPalette = (onOpen) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
      if (e.altKey && e.key === '/') {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
};

export const fuzzySearch = (query, items, searchKey = 'label') => {
  if (!query) return items;

  const queryLower = query.toLowerCase();
  const scored = items.map(item => {
    const text = item[searchKey]?.toLowerCase() || '';
    let score = 0;
    let searchIndex = 0;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === queryLower[searchIndex]) {
        score += 1;
        searchIndex++;
      } else {
        score -= 0.5;
      }

      if (searchIndex === queryLower.length) {
        score += (text.length - i) * 10;
        break;
      }
    }

    return { ...item, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
};
