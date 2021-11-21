import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Preview from './components/Preview';
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
  const [openPreview, setOpenPreview] = useState(false);
  const [cur, setCur] = useState(0);
  const [tab, setTab] = useState(Tab.Home);

  const {data, setData, loading} = useFetch({tab, selected, after});

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

  const openPreviewHandler = i => {
    setOpenPreview(true);
    setCur(i);
  };

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
      {data && (
        <Grid
          data={data}
          addFavourite={addFavourite}
          removeFav={removeFav}
          openPreviewHandler={openPreviewHandler}
          tab={tab}
        />
      )}
      {loading && <Loader />}
      {openPreview && (
        <Preview
          handleClose={() => setOpenPreview(false)}
          handleRight={() => cur !== data.length - 1 && setCur(cur + 1)}
          handleLeft={() => cur !== 0 && setCur(cur - 1)}
          data={data[cur]}
        />
      )}
    </main>
  );
};

export default App;
