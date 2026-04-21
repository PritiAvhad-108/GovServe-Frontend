import api from './api'; 


export const getAssignedCases = (officerId) => 
    api.get(`/Case/assigned/${officerId}`);

export const getCaseDetails = (caseId) => {
    return api.get(`/Case/case-details/${caseId}`);
};

export const approveCase = async (caseId) => {
    return api.put(`/Case/${caseId}/approve`);
};

export const rejectCase = async (caseId, reason) => {
    return api.put(`/Case/${caseId}/reject`, JSON.stringify(reason), {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const updateCaseStatus = (data) => 
    api.put(`/Case/update-status`, data);

export const getCasesByStatus = (officerId, status) => {
    return api.get(`/Case/cases-by-status/${officerId}/${status}`);
};

// Changed from /Officer/ to /Case/
export const markCaseAsPending = async (caseId) => {
    return await api.put(`/Case/MarkPending/${caseId}`); 
};


export const getOfficerDashboardCount = async (officerId) => {
    return await api.get(`/Case/dashboard/${officerId}`);
};

export const getOfficerDetailedDashboard = async (officerId) => {
    return await api.get(`/Case/officer-detailed-dashboard/${officerId}`); 
};

export const getOfficerNotifications = (officerId) => {
    return api.get(`/Case/notifications/${officerId}`);
};

export const markAsRead = (notificationId) => 
    api.put(`/Notification/mark-read/${notificationId}`);


export const getDocumentsByApplicationId = async (applicationId) => {
    return await api.get(`/CitizenDocument/GetDocumentsByApplicationId/${applicationId}`);
};



export const approveDocument = async (documentId) => {
    const response = await api.put(`/CitizenDocument/ApproveDocument/${documentId}?id=${documentId}`);
    return response.data;
};


export const rejectDocument = async (documentId) => {
    const response = await api.put(`/CitizenDocument/RejectDocument/${documentId}?id=${documentId}`);
    return response.data;
};