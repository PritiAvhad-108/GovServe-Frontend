// src/components/AdminComponents/layout/OfficerLayout/OfficerNavbar.jsx

import React from 'react';
// ✅ IMPORT YOUR NEW COMPONENT HERE
import NotificationBell from '../../../pages/OfficerPages/notifications/OfficerNotifications';

const OfficerNavbar = () => {
    return (

        <nav style={{ 
            height: '70px', 
            background: '#1a3a8a', /* 🔵 GovServe Dark Blue Color */
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            color: 'white', 
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>

           
    
            {/* Left side Logo */}
            <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
                GovServe <span style={{fontSize: '14px', fontWeight: 'normal', opacity: 0.8}}>(Officer)</span>
            </div>

            {/* Right side Profile and Alerts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                {/* 🚨 This is your floating dropdown Bell! */}
                <NotificationBell />

                {/* Profile Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px' }}>
                    <span className="material-icons">account_circle</span>
                    <span style={{ fontWeight: '500' }}>Officer</span>
                </div>
            </div>
        </nav>
    );
};

export default OfficerNavbar;