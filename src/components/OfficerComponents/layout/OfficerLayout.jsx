import React from 'react';
import { Outlet } from 'react-router-dom';
import OfficerSidebar from './OfficerSidebar'; 
import OfficerNavbar from './OfficerNavbar';
import './OfficerLayout.css';
import Footer from './footer'; 

const OfficerLayout = () => {
    return (
    
        <div className="officer-layout-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            
        
            <OfficerNavbar />

          
            <div className="officer-main-wrapper" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                
                <OfficerSidebar />

        
                <div className="officer-page-view" style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>

                
                    <Outlet /> 
                    {/* Footer */}
                <Footer />
 


                </div>
            </div>
        </div>
    );
};

export default OfficerLayout;