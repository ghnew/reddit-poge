/* eslint-disable jsx-a11y/anchor-is-valid */
import { Tab } from '../constants';

const GridItem = ({addFavourite, removeFav, openPreviewHandler, tab, item, i}) => (
  <div key={item.id} className="grid-item">
    <a href={item.image} target="_blank" rel="noreferrer">
      <i className="fa fa-picture-o"></i>
    </a>
    <a href={item.url} target="_blank" rel="noreferrer">
      {' '}
      <i className="fa fa-link"></i>
    </a>
    {tab === Tab.Home && (
      <a onClick={() => addFavourite(item)}>
        {' '}
        <i className="fa fa-heart"></i>
      </a>
    )}
    {tab === Tab.Fav && (
      <a onClick={() => removeFav(item.id, i)}>
        {' '}
        <i className="fa fa-remove"></i>
      </a>
    )}
    <span className={'tag ' + item.type}>{item.type.toUpperCase()}</span>
    <img
      className="thumb"
      src={item.thumb}
      alt={item.title}
      title={item.title}
      onClick={() => openPreviewHandler(i)}
    />
  </div>
);

export default GridItem;
