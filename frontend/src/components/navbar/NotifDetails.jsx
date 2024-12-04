import '../../styles/notifDetails.css';
import trash from '../../images/icons/trash.svg';
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';

export default function NotifDetails({ notifications,setNotifications, isVisible }) {
    const [removing, setRemoving] = useState([]);
    const [removingAll, setRemovingAll] =useState();

    const containerRef = useRef(null);

    function handleNotifDelete(id){
        setRemoving((prev) => [...prev, id]);

        setTimeout(() => {
            setNotifications((curr)=>(
                curr.filter(currnotif=> currnotif.id !== id)
            ));
            setRemoving((prev) => (
                prev.filter((remId) => remId !== id)
            ))
        },250)
    }

    function handleRemoveAll(){
        setRemovingAll(true);
        
        setTimeout(() => {
            setNotifications([]);
            setRemovingAll(false)
        }, 250)
    }

    useEffect(() => {
        if (containerRef.current) {
            if (isVisible) {
                containerRef.current.style.display = 'flex';
                containerRef.current.offsetHeight;
                containerRef.current.classList.add('visible');
            } else {
                containerRef.current.classList.remove('visible');
                const timer = setTimeout(() => {
                    if (!isVisible && containerRef.current) {
                        containerRef.current.style.display = 'none';
                    }
                }, 250);
                return () => clearTimeout(timer);
            }
        }
    }, [isVisible]);

    return (
        <div className="notifDetails" ref={containerRef}>
            <div className="topDetails">
                <h3>Notifications</h3>
                <button className='dismiss' onClick={() => handleRemoveAll()} disabled={notifications.length === 0}>Dismiss All</button>
            </div>
            <div className={`notif-list ${removingAll ? 'removing' : ''}`}>
                {notifications && notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div className={`messageContainer ${removing.includes(notification.id) ? 'removing' : ''}`} key={notification.id}>
                        <button className='deletebut' 
                        onClick={()=> handleNotifDelete(notification.id)}>
                            <img src={trash} alt='delete' />
                        </button>
                        <div key={notification.id} className="notif-item">
                            <h4>{notification.title}</h4>
                            <p>{notification.desc}</p>
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