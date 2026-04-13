import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7027/api",
});

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");

//   req.headers["Content-Type"] = "application/json";

//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// Export both the instance and helper functions
export default API;

export const getDashboardStats = () => API.get("/Case/dashboard-stats");
export const getApplications = () => API.get("/Application/all");
export const getAllCases = () => API.get("/Case/all");
export const getCaseDetails = (id) => API.get(`/Case/case-details/${id}`);
export const getDepartments = () => API.get("/Department");
export const getOfficers = (id) => API.get(`/Officer/by-department/${id}`);
export const assignCase = (data) => API.post("/Case/assign", data);
export const autoAssignCase = (data) => API.post("/Case", data);
export const updateStatus = (id, data) => API.put(`/Case/update-status/${id}`, data);
export const getSLABreachedCases = () => API.get("/Case/sla-breached");
export const getEscalationCount = () => API.get("/Escalation/count");
export const getOfficerStatistics = () => API.get("/Case/officer-statistics");
export const getCitizenByApplication = (applicationId) => API.get(`/CitizenDetails/by-application/${applicationId}`);
export const sendNotification = (data) =>API.post("/Notification/send", data);
export const getNotificationsByUser = (userId) =>API.get(`/Notification/all/${userId}`);
export const markNotificationRead = (notificationId) =>API.put(`/Notification/mark-read/${notificationId}`);
export const reassignEscalatedCase = (caseId, newOfficerId) =>API.post("/Case/reassign-escalated", null, {params: { caseId, newOfficerId },});
export const autoEscalateCases = () =>API.post("/Escalation/auto-escalate");
export const getAllUsers = () => { return API.get("/User/all");};
export const getRoles = () => API.get("/Roles");
export const getServices = () => API.get("/Services");

