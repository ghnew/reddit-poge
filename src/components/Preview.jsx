import { useHotkeys } from 'react-hotkeys-hook';
import { useState } from 'react';
import Loader from './Loader';

const Preview = ({
  data: { video, image, type },
  handleClose,
  handleRight,
  handleLeft,
  addFavourite,
}) => {
  const [loading, setLoading] = useState(true);
  useHotkeys(
    'esc',
    () => {
      setLoading(true);
      handleClose();
    },
    [handleClose]
  );
  useHotkeys(
    'left',
    () => {
      setLoading(true);
      handleLeft();
    },
    [handleLeft]
  );
  useHotkeys(
    'right',
    () => {
      setLoading(true);
      handleRight();
    },
    [handleRight]
  );
  useHotkeys('alt+r', addFavourite, [addFavourite]);

  return (
    <div className="preview">
      {loading && <Loader theme="light" />}
      {type === 'video' ? (
        <video
          onLoadStart={() => {
            setLoading(false);
          }}
          controls
          autoPlay
          src={video}
        ></video>
      ) : (
        <img
          style={!loading ? {} : { display: 'none' }}
          onLoad={() => {
            setLoading(false);
          }}
          src={image}
          alt=""
        />
      )}
      <i onClick={handleClose} className="fa fa-remove close"></i>
      <i onClick={addFavourite} className="fa fa-heart heart"></i>
    </div>
  );
};

export default Preview;
