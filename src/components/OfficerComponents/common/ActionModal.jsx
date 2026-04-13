import React, { useState } from 'react';
import './ActionModel.css'; // खाली दिलेला CSS वापरा

const ActionModal = ({ isOpen, onClose, onConfirm, title }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert("Give reason for rejection.");
            return;
        }
        onConfirm(reason);
        setReason(''); 
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                     (Reason for Rejection) <span className="text-red-500">*</span>
                </label>
                <textarea
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                    rows="4"
                    placeholder="write reason here..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>
                
                <div className="flex justify-end gap-3 mt-5">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded-md font-bold">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;