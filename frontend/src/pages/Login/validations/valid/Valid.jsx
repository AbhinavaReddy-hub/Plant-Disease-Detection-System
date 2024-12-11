import './Valid.css';

function Valid({ uname, fullScreen }) {
  return (
    <div className={`valid-container ${fullScreen ? "full" : ""}`}>
      <p>Welcome {uname}!</p>
    </div>
  );
}

export default Valid;