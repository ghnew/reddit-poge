import GridItem from './GridItem';

const Grid = ({ data, tab, addFavourite, removeFav, openPreviewHandler }) => (
  <div className="grid-container mb-5">
    {data.map((item, i) => (
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
);

export default Grid;
