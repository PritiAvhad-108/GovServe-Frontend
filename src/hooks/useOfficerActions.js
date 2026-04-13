import { useState } from 'react';
// Added rejectCase to the imports
import { approveCase, updateCaseStatus, rejectCase } from '../api/officerApi';

const useOfficerActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Approve Logic (User Story 5)
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

    // 2. Reject Logic (User Story 6) - UPDATED TO MATCH SWAGGER
    const handleReject = async (caseId, reason, onSuccess) => {
        try {
            setLoading(true);
            setError(null);
            
            // Call the specific reject API we set up for Swagger
            const response = await rejectCase(caseId, reason);
            
            // Get the success message from the backend response, or use a default
            const message = response?.message || "Case rejected successfully.";
            
            if (onSuccess) onSuccess(message);
        } catch (err) {
            // Check for API error response first, fallback to standard error message
            const errorMsg = err.response?.data?.message || err.message || "Failed to reject case";
            setError(errorMsg);
            alert("Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // 3. Document Verification / Status Update Logic (User Story 4 & 7)
    const handleUpdateStatus = async (caseId, status, remarks, onSuccess) => {
        try {
            setLoading(true);
            setError(null);
            const payload = {
                caseId: caseId,
                status: status, // e.g., 'Under Verification'
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