import  { useState, useEffect } from 'react';
import { Tab } from '../constants';
import { mapData } from '../utils';
import { useIndexedDBStore } from 'use-indexeddb';

const useFetch = ({tab, selected, after}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const store = useIndexedDBStore('favourites');

  useEffect(() => {
    setLoading(true);
    if (tab === Tab.Fav) {
      store
        .getAll()
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
      return;
    }
    if (!selected) return;
    const qString = selected.startsWith('u/')
      ? `https://www.reddit.com/user/${selected.slice(2)}/.json?after=${after}`
      : `https://www.reddit.com/${selected}/.json?after=${after}`;
    fetch(qString)
      .then(res => res.json())
      .then(res => {
        setData(prev => {
          return prev[0]?.subreddit?.toLowerCase() === selected?.toLowerCase()
            ? [
                ...prev,
                ...Object.values(res.data.children).map(({ data }) =>
                  mapData(data)
                ),
              ]
            : Object.values(res.data.children).map(({ data }) => mapData(data));
        });
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError(err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [after, selected, tab]);
  return { data, setData, error, loading };
};

export default useFetch;
