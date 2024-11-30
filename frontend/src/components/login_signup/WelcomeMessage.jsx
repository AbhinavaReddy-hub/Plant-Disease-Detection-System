import '../../styles/welcomeMessage.css';

function WelcomeMessage({ uname }) {
  return (
    <div className={`valid-container`}>
      <p>Welcome {uname}!</p>
    </div>
  );
}

export default WelcomeMessage;