import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Preview from './components/Preview';
import Loader from './components/Loader';
import Grid from './components/Grid';
import { useIndexedDBStore } from 'use-indexeddb';
import { getMediaType } from './utils';
import { Tab } from './constants';
import Sidebar from './components/Sidebar';

const App = () => {
  const store = useIndexedDBStore('favourites');

  const [data, setData] = useState([]);
  const [after, setAfter] = useState('');

  const [selected, setSelected] = useState();
  const [openPreview, setOpenPreview] = useState(false);
  const [cur, setCur] = useState(0);
  const [tab, setTab] = useState(Tab.Home);
  const [loading, setLoading] = useState(false);

  const mapData = data => {
    return {
      id: data.id,
      name: data.name,
      title: data.title,
      thumb: data.thumbnail,
      type: getMediaType(data.url),
      image: data.url,
      url: 'https://www.reddit.com' + data.permalink,
      subreddit: data.subreddit.startsWith('u_')
        ? 'u/' + data.subreddit.slice(2)
        : 'r/' + data.subreddit,
      video: data?.media?.reddit_video?.fallback_url,
    };
  };

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
          console.error(err);
          setLoading(false);
        });
    } else {
      if (!selected) return;
      const qString = selected.startsWith('u/')
        ? `https://www.reddit.com/user/${selected.slice(
            2
          )}/.json?after=${after}`
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
              : Object.values(res.data.children).map(({ data }) =>
                  mapData(data)
                );
          });
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [after, selected, tab]);

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
