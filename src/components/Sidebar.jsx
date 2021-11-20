import { useState, useRef, useEffect } from 'react';
import { useIndexedDBStore } from 'use-indexeddb';
import { Tab } from '../constants';
import { get, set } from '../utils';

const Sidebar = ({
  setSelected,
  tab,
  selected,
  setAfter,
  loadMore,
  switchTab,
}) => {
  const [uploading, setUploading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const uploadInput = useRef();
  const store = useIndexedDBStore('favourites');
  const [list, setList] = useState([]);

  useEffect(() => {
    const cur = get('R_LIST');
    if (cur) {
      setList(cur);
      setSelected(cur[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    set('R_LIST', list);
  }, [list]);

  const download = () => {
    store
      .getAll()
      .then(data => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(data)], { type: 'text/json' })
        );
        a.href = url;
        a.download = 'backup.json';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(console.error);
  };

  const upload = e => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = e =>
      store
        .getAll()
        .then(dbData => {
          const uploadData = JSON.parse(e.target.result);
          uploadData.forEach(item => {
            if (!dbData.some(i => i.id === item.id)) store.add(item);
          });
          // ? store.add(s) might not have completed yet
          setUploading(false);
        })
        .catch(err => {
          if (err.name === 'SyntaxError') alert('Invalid JSON!');
          setUploading(false);
          console.error(err);
        });
    reader.readAsText(e.target.files[0]);
  };
  const handleSelected = e => {
    if (e.key === 'Enter') {
      setList([...list, e.target.value]);
      setSelected(e.target.value);
      setInputValue('');
    }
  };

  const removeItem = index => {
    if (window.confirm('Are you sure?')) {
      setList(list.filter((_, i) => i !== index));
      setSelected(list[0]);
    }
  };

  return (
    <div className="sidebar">
      {tab === Tab.Home && (
        <>
          <input
            type="text"
            placeholder="eg. r/* or u/*"
            onKeyDown={handleSelected}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <ul className="sidebar-list">
            {list.map((cur, i) => (
              <li key={cur}>
                <a
                  onClick={() => {
                    setAfter('');
                    setSelected(cur);
                  }}
                  className={'link' + (cur === selected ? ' active' : '')}
                  href="/#"
                >
                  {cur}
                </a>
                <a onClick={() => removeItem(i)} className="link" href="/#">
                  {' '}
                  <i className="fa fa-remove"></i>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="bottom">
        <button className="icon" onClick={loadMore}>
          <i className="fa fa-rotate-right"></i>
        </button>
        <button className="icon ml-5" onClick={switchTab}>
          {tab === Tab.Fav ? (
            <i className="fa fa-home" />
          ) : (
            <i className="fa fa-heart" />
          )}
        </button>
        <button className="icon ml-5" onClick={download}>
          <i className="fa fa-download" />
        </button>

        <button
          className="icon ml-5"
          onClick={() => uploadInput.current?.click()}
          disabled={uploading}
        >
          <i
            className={`fa ${
              uploading ? 'fa-circle-o-notch fa-spin fa-fw' : 'fa-upload'
            }`}
          />
        </button>

        <input
          hidden
          type="file"
          accept=".json"
          onChange={upload}
          ref={uploadInput}
        />
      </div>
    </div>
  );
};

export default Sidebar;
