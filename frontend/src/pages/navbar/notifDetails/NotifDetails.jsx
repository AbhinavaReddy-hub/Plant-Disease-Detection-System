import './notifDetails.css';
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function NotifDetails({ isVisible, userId }) {
    const [notifications, setNotifications] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        // Fetch notifications from the backend
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };
        fetchNotifications();
    }, [userId]);

    useEffect(() => {
        if (containerRef.current) {
            if (isVisible) {
                containerRef.current.style.display = 'flex';
                containerRef.current.offsetHeight; // Trigger reflow
                containerRef.current.classList.add('visible');
            } else {
                containerRef.current.classList.remove('visible');
                const timer = setTimeout(() => {
                    if (!isVisible && containerRef.current) {
                        containerRef.current.style.display = 'none';
                    }
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isVisible]);

    const handleDelete = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:5000/api/notifications/delete`, {
                headers: { 'Content-Type': 'application/json' },
                data: { userId, notificationId }
            });
            setNotifications((curr) => curr.filter((notif) => notif.id !== notificationId));
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };
   
    const handleNotificationClick = (blogUrl) => {
        if (blogUrl) {
            window.open(blogUrl, '_blank'); // Open blog in a new tab
        } else {
            alert("No related blog found.");
        }
    };
    return (
        <div className="notifDetails" ref={containerRef}>
            <h3>Notifications</h3>
            <div className="notif-list">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div className='messagecontainer' key={notification.id}>
                            <button className='deletebut' onClick={() => handleDelete(notification.id)}>
                                <MdDelete />
                            </button>
                            <div 
                                className="notif-item" 
                                onClick={() => handleNotificationClick(notification.blogUrl)}
                                style={{ cursor: notification.blogUrl ? 'pointer' : 'default' }}
                            >
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
