import { useState } from 'react';

import { approveCase, updateCaseStatus, rejectCase } from '../api/officerApi';

const useOfficerActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   
    const handleApprove = async (caseId, onSuccess) => {
        try {
            setLoading(true);
            setError(null);
            await approveCase(caseId);
            if (onSuccess) onSuccess("Case approved successfully!");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to approve case";
            setError(errorMsg);
            alert("Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    
    const handleReject = async (caseId, reason, onSuccess) => {
        try {
            setLoading(true);
            setError(null);
            
            
            const response = await rejectCase(caseId, reason);
            
           
            const message = response?.message || "Case rejected successfully.";
            
            if (onSuccess) onSuccess(message);
        } catch (err) {
           
            const errorMsg = err.response?.data?.message || err.message || "Failed to reject case";
            setError(errorMsg);
            alert("Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateStatus = async (caseId, status, remarks, onSuccess) => {
        try {
            setLoading(true);
            setError(null);
            const payload = {
                caseId: caseId,
                status: status, 
                remarks: remarks
            };
            await updateCaseStatus(payload);
            if (onSuccess) onSuccess(`Status updated to ${status}`);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to update status";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        handleApprove,
        handleReject,
        handleUpdateStatus,
        loading,
        error
    };
};

export default useOfficerActions;