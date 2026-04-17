import axios from "axios";

/* ===============================
   ✅ AXIOS INSTANCE + JWT TOKEN
================================ */

const api = axios.create({
  baseURL: "https://localhost:7027/api",
});

// ✅ Auto add Bearer token
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

/* ===============================
   ✅ GRIEVANCE APIs
================================ */

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

/* ===============================
   ✅ CASE APIs
================================ */

export const getCaseDetailsByCaseId = (caseId) =>
  api.get(`/Case/case-details/${caseId}`);

/* ===============================
   ✅ APPEAL APIs
================================ */

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

/* ===============================
   ✅ NOTIFICATION APIs
================================ */

export const getUserNotifications = (userId) =>
  api.get(`/Notification/user/${userId}`);

/* ===============================
   ✅ DOCUMENT APIs
================================ */

export const getDocumentsByApplicationId = (applicationId) =>
  api.get(`/CitizenDocument/GetDocumentsByApplicationId/${applicationId}`);