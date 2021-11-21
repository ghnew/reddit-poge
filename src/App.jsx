import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Loader from './components/Loader';
import Grid from './components/Grid';
import { Tab } from './constants';
import Sidebar from './components/Sidebar';
import useFetch from './hooks/useFetch';

const App = () => {
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
      <Grid data={data} setData={setData} tab={tab} />
      {loading && (
        <div className="toolbar">
          <Loader theme="dark" />
        </div>
      )}
    </main>
  );
};

export default App;
