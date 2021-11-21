import { useHotkeys } from 'react-hotkeys-hook';

const Preview = ({
  data: { video, image, type },
  handleClose,
  handleRight,
  handleLeft,
  addFavourite
}) => {
  useHotkeys('esc', handleClose, [handleClose]);
  useHotkeys('left', handleLeft, [handleLeft]);
  useHotkeys('right', handleRight, [handleRight]);
  useHotkeys('alt+r', addFavourite, [addFavourite]);

  return (
    <div className="preview">
      {type === 'video' ? (
        <video controls autoPlay src={video}></video>
      ) : (
        <img src={image} alt="" />
      )}
      <i onClick={handleClose} className="fa fa-remove close"></i>
      <i onClick={addFavourite} className="fa fa-heart heart"></i>
    </div>
  );
};

export default Preview;
