import trash from "../../images/icons/trash.svg";
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import "../../styles/notifDetails.css";

export default function NotifDetails({
  allViewed,
  setAllViewed,
  notifications,
  setNotifications,
  isVisible,
}) {
  const [removing, setRemoving] = useState([]);
  const [removingAll, setRemovingAll] = useState();

  const containerRef = useRef(null);
  const notifListRef = useRef(null);

  function handleNotifDelete(id) {
    setRemoving((prev) => [...prev, id]);

    setTimeout(() => {
      setNotifications((curr) =>
        curr.filter((currnotif) => currnotif.id !== id)
      );
      setRemoving((prev) => prev.filter((remId) => remId !== id));
    }, 250);
  }

  function handleRemoveAll() {
    setRemovingAll(true);

    setTimeout(() => {
      setRemovingAll(false);
      setNotifications([]);
    }, 250);
  }

  useEffect(() => {
    if (containerRef.current) {
      if (isVisible) {
        containerRef.current.style.display = "flex";
        containerRef.current.offsetHeight;
        containerRef.current.classList.add("visible");
      } else {
        containerRef.current.classList.remove("visible");
        const timer = setTimeout(() => {
          if (!isVisible && containerRef.current) {
            containerRef.current.style.display = "none";
          }
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible]);




  const handleScroll = () => {
    if (notifListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = notifListRef.current;
        if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
            setAllViewed(true); 
        }
    }
};

useEffect(() => {
    const notifList = notifListRef.current;
    if (notifList) {
        notifList.addEventListener('scroll', handleScroll);
        return () => notifList.removeEventListener('scroll', handleScroll);
    }
}, []);

  return (
    <div className={`notifDetails`} ref={containerRef}>
      <div
        className={`topDetails  ${
          notifications.length === 0 ? "no-dismiss" : ""
        }`}
      >
        <h3>Notifications</h3>
        {notifications.length > 0 && (
          <button
            className={`dismiss ${removingAll ? "hidden" : ""}`}
            onClick={handleRemoveAll}
          >
            Dismiss All
          </button>
        )}
      </div>
      <div className={`notif-list ${removingAll ? "removing" : ""}`} ref={notifListRef}> 
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              className={`messageContainer ${
                removing.includes(notification.id) ? "removing" : ""
              }`}
              key={notification.id}
            >
              <div key={notification.id} className="notifItem">
                <div className="mainContent">
                  <h4>{notification.title}</h4>
                  <p>{notification.desc}</p>
                </div>
                <button
                  className="deletebut"
                  onClick={() => handleNotifDelete(notification.id)}
                >
                  <img src={trash} alt="delete" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-notifs">No new notifications</p>
        )}
      </div>
    </div>
  );
}
