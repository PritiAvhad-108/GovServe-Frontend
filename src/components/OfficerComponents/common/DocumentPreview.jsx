import React from 'react';

const DocumentPreview = ({ fileUrl }) => {
    if (!fileUrl) return <div className="no-doc"><p>No document selected.</p></div>;

    const cleanUrl = fileUrl.trim();
    const urlLower = cleanUrl.toLowerCase();

    // 1. Explicit Image Check
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(urlLower);

    // 2. "Assume PDF" Logic
    // If it's not an image, we attempt to show it in an iframe. 
    // Most modern browsers will handle PDFs even if the URL is a generic API route.
    
    return (
        <div className="preview-container" style={{ width: '100%', height: '600px', backgroundColor: '#f8fafc' }}>
            {isImage ? (
                <div className="preview-container" style={{ width: '100%', height: '600px', backgroundColor: '#f8fafc', border: '1px solid #ddd' }}>
        <iframe
            src={`${cleanUrl}#toolbar=0`}
            title="Document Preview"
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block' }}
        >
            <p>Unable to display PDF. <a href={cleanUrl} target="_blank" rel="noreferrer">Download instead</a></p>
        </iframe>
    </div>
            ) : (
                /* We use an iframe for EVERYTHING else. 
                   Adding #toolbar=0&navpanes=0 helps clean up the UI for PDFs.
                */
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