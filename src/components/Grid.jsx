import { useState, useEffect } from 'react';
import { useIndexedDBStore } from 'use-indexeddb';
import GridItem from './GridItem';
import Preview from './Preview';

const Grid = ({ data, tab, setData }) => {
  const [items, setItems] = useState(data);
  const [filter, setFilter] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [cur, setCur] = useState(0);

  const store = useIndexedDBStore('favourites');

  useEffect(() => {
    if (!filter) return setItems(data);
    setItems(data.filter(item => item.type === filter));
  }, [filter, data]);

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

  const openPreviewHandler = i => {
    setOpenPreview(true);
    setCur(i);
  };

  return (
    <>
      <select
        defaultValue=""
        onChange={e => setFilter(e.target.value)}
        className="toolbar mb-5"
      >
        <option value="" disabled hidden>
          Select a filter
        </option>
        <option value="">None</option>
        <option value="image">Image</option>
        <option value="gif">GIF</option>
        <option value="video">Video</option>
        <option value="unknown">Unknown</option>
      </select>
      {!!items.length && (
        <div className="grid-container mb-5">
          {items.map((item, i) => (
            <GridItem
              key={item.id}
              addFavourite={addFavourite}
              removeFav={removeFav}
              openPreviewHandler={openPreviewHandler}
              tab={tab}
              item={item}
              i={i}
            />
          ))}
        </div>
      )}
      {openPreview && (
        <Preview
          handleClose={() => setOpenPreview(false)}
          handleRight={() => cur !== items.length - 1 && setCur(cur + 1)}
          handleLeft={() => cur !== 0 && setCur(cur - 1)}
          addFavourite={() => {addFavourite(items[cur])}}
          data={items[cur]}
        />
      )}
    </>
  );
};

export default Grid;
