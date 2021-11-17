import { useHotkeys } from "react-hotkeys-hook";

const Preview = ({ img, handleClose, handleRight, handleLeft }) => {
  useHotkeys("esc", handleClose, [handleClose]);
  useHotkeys("left", handleLeft, [handleLeft]);
  useHotkeys("right", handleRight, [handleRight]);
	
  return (
    <div className="preview">
      <img src={img} alt="" />
      <span onClick={handleClose} className="close">
        &#10005;
      </span>
    </div>
  );
};

export default Preview;
