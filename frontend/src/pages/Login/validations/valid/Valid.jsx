import './Valid.css';

function Valid({ uname }) {
  return (
    <div className={`valid-container`}>
      <p>Welcome {uname}!</p>
    </div>
  );
}

export default Valid;