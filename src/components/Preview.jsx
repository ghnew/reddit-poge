import { useHotkeys } from "react-hotkeys-hook";

const Preview = ({ data : { video, image, type }, handleClose, handleRight, handleLeft }) => {
  useHotkeys("esc", handleClose, [handleClose]);
  useHotkeys("left", handleLeft, [handleLeft]);
  useHotkeys("right", handleRight, [handleRight]);
	
  return (
    <div className="preview">
      {type === 'video' ? (
        <video controls autoPlay src={video}></video>
      ) : (
        <img src={image} alt="" />
      )}
      <span onClick={handleClose} className="close">
        &#10005;
      </span>
    </div>
  );
};

export default Preview;
