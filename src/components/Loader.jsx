const Loader = ({theme}) => (
  <div className="loading">
    <i
      className="fa fa-circle-o-notch fa-spin fa-fw fa-2x"
      style={{ color: theme === 'light' ? '#fff' : '#000' }}
    ></i>
  </div>
);

export default Loader;
