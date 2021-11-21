import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Loader from './components/Loader';
import Grid from './components/Grid';
import { useIndexedDBStore } from 'use-indexeddb';
import { Tab } from './constants';
import Sidebar from './components/Sidebar';
import useFetch from './hooks/useFetch';

const App = () => {
  const store = useIndexedDBStore('favourites');

  const [after, setAfter] = useState('');

  const [selected, setSelected] = useState();

  const [tab, setTab] = useState(Tab.Home);

  const { data, setData, loading } = useFetch({ tab, selected, after });

  const loadMore = () => setAfter(data[data.length - 1].name);

  const switchTab = () =>
    setTab(prev => {
      if (prev === Tab.Home) {
        return Tab.Fav;
      } else {
        setData([]);
        return Tab.Home;
      }
    });

  useHotkeys('alt+w', loadMore, [loadMore]);
  useHotkeys('alt+q', switchTab, [switchTab]);

  const addFavourite = data => {
    store.add(data).then(console.log);
    alert('added to favorites');
  };

  const removeFav = (id, index) => {
    if (window.confirm('Are you sure?')) {
      store
        .deleteByID(id)
        .then(() => {
          setData(data.filter((_, i) => i !== index));
        })
        .catch(console.error);
    }
  };

  return (
    <main>
      <Sidebar
        setSelected={setSelected}
        tab={tab}
        selected={selected}
        setAfter={setAfter}
        loadMore={loadMore}
        switchTab={switchTab}
      />
      {!!data.length && (
        <Grid
          data={data}
          addFavourite={addFavourite}
          removeFav={removeFav}
          tab={tab}
        />
      )}
      {loading && <Loader />}

    </main>
  );
};

export default App;
