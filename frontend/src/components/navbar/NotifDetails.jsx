import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';
import '../../styles/notifDetails.css';

export default function NotifDetails({allViewed,setAllViewed, notifications,setNotifications, isVisible }) {

    const containerRef = useRef(null);
    const notifListRef = useRef(null);

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
    const handleScroll = () => {
        if (notifListRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = notifListRef.current;
            if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
                setAllViewed(); 
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
        <div className="notifDetails" ref={containerRef}>
            <h3>Notifications</h3>
            <div className="notif-list" ref={notifListRef}>
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