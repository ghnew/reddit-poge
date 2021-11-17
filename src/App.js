import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Preview from "./Preview";
import { useIndexedDBStore } from "use-indexeddb";

const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const get = (key) => JSON.parse(localStorage.getItem(key));

const Tab = {
  Home: 0,
  Fav: 1,
};

const Loader = () => (
  <div className="loading">
    <i className="fa fa-circle-o-notch fa-spin fa-fw fa-2x"></i>
  </div>
);

const App = () => {
  const [data, setData] = useState([]);
  const [after, setAfter] = useState("");
  // const [list, setList] = useState(["gonewild", "NSFW_Wallpapers"]);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState();
  const [inputValue, setInputValue] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [cur, setCur] = useState(0);
  const [tab, setTab] = useState(Tab.Home);
  const [loading, setLoading] = useState(false);

  const store = useIndexedDBStore("favourites");

  useEffect(() => {
    const cur = get("R_LIST");
    if (cur) {
      setList(cur);
      setSelected(cur[0]);
    }
  }, []);

  useEffect(() => {
    set("R_LIST", list);
  }, [list]);

  const mapData = (data) => {
    return {
      id: data.id,
      name: data.name,
      title: data.title,
      thumb: data.thumbnail,
      image: data.url,
      url: "https://www.reddit.com" + data.permalink,
      subreddit: data.subreddit,
    };
  };

  useEffect(() => {
    setLoading(true);
    if (tab === Tab.Fav) {
      store
        .getAll()
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      if (!selected) return;
      fetch(`https://www.reddit.com/r/${selected}/.json?after=${after}`)
        .then((res) => res.json())
        .then((res) => {
          setData((prev) =>
            prev[0]?.subreddit === selected
              ? [
                  ...prev,
                  ...Object.values(res.data.children).map(({ data }) =>
                    mapData(data)
                  ),
                ]
              : Object.values(res.data.children).map(({ data }) =>
                  mapData(data)
                )
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [after, selected, tab]);

  const loadMore = () => setAfter(data[data.length - 1].name);
  const toggleHandler = () =>
    setTab((prev) => {
      if (prev === Tab.Home) {
        return Tab.Fav;
      } else {
        setData([]);
        return Tab.Home;
      }
    });

  useHotkeys("alt+w", loadMore, [loadMore]);
  useHotkeys("alt+q", toggleHandler, [toggleHandler]);

  const handleSelected = (e) => {
    if (e.key === "Enter") {
      setList([...list, e.target.value]);
      setSelected(e.target.value);
      setInputValue("");
    }
  };
  const removeItem = (index) => {
    if (window.confirm("Are you sure?")) {
      setList(list.filter((i, Id) => Id !== index));
      setSelected(list[0]);
    }
  };
  const openPreviewHandler = (i) => {
    setOpenPreview(true);
    setCur(i);
  };
  const addFavourite = (data) => {
    console.log(data);
    store.add(data).then(console.log);
  };
  const removeFav = (id, index) => {
    store
      .deleteByID(id)
      .then(() => {
        if (window.confirm("Are you sure?")) {
          setData(data.filter((data, i) => i !== index));
        }
      })
      .catch(console.error);
  };

  return (
    <main>
      <div className="sidebar">
        {tab === Tab.Home && (
          <>
            <input
              type="text"
              placeholder="eg. gonewild"
              onKeyDown={handleSelected}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <ul className="sidebar-list">
              {list.map((cur, i) => (
                <li key={cur}>
                  <a
                    onClick={() => {
                      setAfter("");
                      setSelected(cur);
                    }}
                    className={"link" + (cur === selected ? " active" : "")}
                    href="/#"
                  >
                    {`r/${cur}`}
                  </a>
                  <a onClick={() => removeItem(i)} className="link" href="/#">
                    {" "}
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
          <button className="icon ml-5" onClick={toggleHandler}>
            {tab === Tab.Fav ? (
              <i className="fa fa-home"></i>
            ) : (
              <i className="fa fa-heart"></i>
            )}
          </button>
        </div>
      </div>
      {data && (
        <div className="grid-container mb-5">
          {data.map((data, i) => (
            <div key={data.id} className="grid-item">
              <a href={data.image} target="_blank" rel="noreferrer">
                <i className="fa fa-picture-o"></i>
              </a>
              <a href={data.url} target="_blank" rel="noreferrer">
                {" "}
                <i className="fa fa-link"></i>
              </a>
              {tab === Tab.Home && (
                <a onClick={() => addFavourite(data)} href="/#">
                  {" "}
                  <i className="fa fa-heart"></i>
                </a>
              )}
              {tab === Tab.Fav && (
                <a onClick={() => removeFav(data.id, i)} href="/#">
                  {" "}
                  <i className="fa fa-remove"></i>
                </a>
              )}
              <img
                className="thumb"
                src={data.thumb}
                alt={data.title}
                title={data.title}
                onClick={() => openPreviewHandler(i)}
              />
            </div>
          ))}
        </div>
      )}
      {loading && <Loader />}
      {openPreview ? (
        <Preview
          handleClose={() => setOpenPreview(false)}
          handleRight={() => (cur !== data.length - 1 ? setCur(cur + 1) : null)}
          handleLeft={() => (cur !== 0 ? setCur(cur - 1) : null)}
          img={data[cur].image}
        />
      ) : null}
    </main>
  );
};

export default App;
