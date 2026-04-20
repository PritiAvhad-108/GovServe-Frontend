import axios from "axios"; 
const api = axios.create({
  baseURL: "https://localhost:7027/api",
});
 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const getAllGrievances = () =>
  api.get("/Grievance/all");
 
export const getPendingGrievanceCount = () =>
  api.get("/Grievance/count/pending");
 
export const getResolvedGrievanceCount = () =>
  api.get("/Grievance/count/resolved");
 
export const resolveGrievance = (id, remarks) =>
  api.put(`/Grievance/resolve/${id}`, { remarks });
 
export const rejectGrievance = (id, remarks) =>
  api.put(`/Grievance/reject/${id}`, { remarks });
 
export const getCaseIdByApplicationId = (applicationId) =>
  api.get(`/Grievance/GetCaseIdByApplicationId/${applicationId}`);
export const getCaseDetailsByCaseId = (caseId) =>
  api.get(`/Case/case-details/${caseId}`);
export const getSubmittedAppeals = () =>
  api.get("/Appeal/submitted");
 
export const getPendingAppealCount = () =>
  api.get("/Appeal/count/pending");
 
export const getResolvedAppealCount = () =>
  api.get("/Appeal/count/Resolve");
 
export const getAppealById = (id) =>
  api.get(`/Appeal/status/${id}`);
 
export const approveAppeal = (appealId, remarks) =>
  api.put("/Appeal/approve", {
    appealID: appealId,
    remarks,
  });
 
export const rejectAppeal = (appealId, remarks) =>
  api.put("/Appeal/reject", {
    appealID: appealId,
    remarks,
  });
 
export const getUserNotifications = (userId) =>
  api.get(`/Notification/user/${userId}`);
 
export const getDocumentsByApplicationId = (applicationId) =>
  api.get(`/CitizenDocument/GetDocumentsByApplicationId/${applicationId}`);
 