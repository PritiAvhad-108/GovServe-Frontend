import React from 'react';

const DocumentPreview = ({ fileUrl }) => {
    if (!fileUrl) return <div className="no-doc"><p>No document selected.</p></div>;

    const cleanUrl = fileUrl.trim();
    const urlLower = cleanUrl.toLowerCase();

    // 1. Explicit Image Check
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(urlLower);
    
    return (
        <div className="preview-container" style={{ width: '100%', height: '600px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {isImage ? (
                /*  FIX: Use an img tag for images so they fit perfectly! */
                <img 
                    src={cleanUrl} 
                    alt="Document Preview" 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
            ) : (
                /* Use iframe for PDFs */
                <iframe
                    src={`${cleanUrl}#toolbar=0&navpanes=0`}
                    title="Document Preview"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ borderRadius: '4px', border: 'none' }}
                >
                    <p>Your browser cannot preview this file. 
                        <a href={cleanUrl} target="_blank" rel="noreferrer">Download/View File</a>
                    </p>
                </iframe>
            )}
        </div>
    );
};

export default DocumentPreview;