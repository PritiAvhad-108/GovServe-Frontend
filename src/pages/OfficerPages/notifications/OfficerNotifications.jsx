import React, { useEffect, useState, useRef } from 'react';
import { getOfficerNotifications } from '../../../api/officerApi';
import './Notifications.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false); 
    
    const dropdownRef = useRef(null); 
    
    const officerId = localStorage.getItem('userId') || 2;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await getOfficerNotifications(officerId);
                
                
                const data = response.data || response;
                setNotifications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [officerId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    
    const unreadCount = notifications.filter(n => 
        n.status && n.status.toLowerCase() === 'unread'
    ).length;

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            <button className="bell-trigger-btn" onClick={() => setIsOpen(!isOpen)}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                </svg>
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notifications-header">
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Notifications</h3>
                        <span className="count-badge">{notifications.length} Total</span>
                    </div>

                    <div className="notifications-list">
                        {loading ? (
                            <div className="loader" style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map((note) => (
                                <div 
                                    key={note.notificationId} 
                                    className={`notification-card ${note.status?.toLowerCase() === 'unread' ? 'unread' : ''}`}
                                >
                                    <div className="note-icon">
                                       
                                        {note.category === 'Assignment' ? '📌' : '🔔'}
                                    </div>
                                    <div className="note-content">
                                        <p className="note-message">{note.message}</p>
                                        <div className="note-meta">
                                            <span className="note-category">{note.category}</span>
                                            <span className="note-date">
                                                {new Date(note.createdDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {note.status?.toLowerCase() === 'unread' && <div className="unread-dot"></div>}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state" style={{ padding: '20px', textAlign: 'center' }}>
                                No notifications found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;