import '../../styles/notifDetails.css';
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';

export default function NotifDetails({ notifications,setNotifications, isVisible }) {

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            if (isVisible) {
                containerRef.current.style.display = 'flex';
                // Trigger reflow
                containerRef.current.offsetHeight;
                containerRef.current.classList.add('visible');
            } else {
                containerRef.current.classList.remove('visible');
                // Wait for animation to complete before hiding
                const timer = setTimeout(() => {
                    if (!isVisible && containerRef.current) {
                        containerRef.current.style.display = 'none';
                    }
                }, 300); // Match this with CSS transition duration
                return () => clearTimeout(timer);
            }
        }
    }, [isVisible]);

    return (
        <div className="notifDetails" ref={containerRef}>
            <h3>Notifications</h3>
            <div className="notif-list">
                {notifications && notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div className='messagecontainer' key={notification.id}>
                        <button className='deletebut' onClick={()=>{
                        setNotifications((curr)=>(
                        curr.filter(currnotif=> currnotif.id!=notification.id)
                            ))
                        }}><span><MdDelete /></span></button>
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