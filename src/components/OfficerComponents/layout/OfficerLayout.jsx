import React from 'react';
import { Outlet } from 'react-router-dom';
import OfficerSidebar from './OfficerSidebar'; 
import OfficerNavbar from './OfficerNavbar';
import './OfficerLayout.css';

const OfficerLayout = () => {
    return (
        /* १. मुख्य कंटेनर: नेव्हबारला वर ठेवण्यासाठी flexDirection: 'column' वापरला आहे */
        <div className="officer-layout-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            
            {/* २. ऑफिसर नेव्हबार: आता हा पूर्ण डावीकडून उजवीकडे (Full Width) दिसेल */}
            <OfficerNavbar />

            {/* ३. खालचा भाग: यामध्ये साईडबार आणि मुख्य आशय (Content) असतील */}
            <div className="officer-main-wrapper" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* ४. ऑफिसर साईडबार: आता हा नेव्हबारच्या खाली सुरू होईल */}
                <OfficerSidebar />

                {/* ५. मुख्य आशय: Outlet मुळे तुझे पेजेस इथे दिसतील */}
                <div className="officer-page-view" style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default OfficerLayout;