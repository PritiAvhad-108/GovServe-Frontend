import axios from "axios";

/* ✅ BASE URLS */
const GRIEVANCE_BASE_URL = "https://localhost:7027/api/Grievance";
const APPEAL_BASE_URL = "https://localhost:7027/api/Appeal";


// Get all grievances
export const getAllGrievances = () =>
  axios.get(`${GRIEVANCE_BASE_URL}/all`);

// Get pending grievance count
export const getPendingGrievanceCount = () =>
  axios.get(`${GRIEVANCE_BASE_URL}/count/pending`);

// Get resolved grievance count
export const getResolvedGrievanceCount = () =>
  axios.get(`${GRIEVANCE_BASE_URL}/count/resolved`);

// Resolve grievance
export const resolveGrievance = (id, remarks) =>
  axios.put(`${GRIEVANCE_BASE_URL}/resolve/${id}`, { remarks });

// Reject grievance
export const rejectGrievance = (id, remarks) =>
  axios.put(`${GRIEVANCE_BASE_URL}/reject/${id}`, { remarks });

/* =========================
   ✅ APPEAL APIs
========================= */

// Get all submitted appeals
export const getSubmittedAppeals = () =>
  axios.get(`${APPEAL_BASE_URL}/submitted`);

// Get pending appeal count
export const getPendingAppealCount = () =>
  axios.get(`${APPEAL_BASE_URL}/count/pending`);

// Get resolved appeal count
export const getResolvedAppealCount = () =>
  axios.get(`${APPEAL_BASE_URL}/count/Resolve`);

// View appeal details by ID
export const getAppealById = (id) =>
  axios.get(`${APPEAL_BASE_URL}/status/${id}`);

// Approve appeal
export const approveAppeal = (appealId, remarks) =>
  axios.put(`${APPEAL_BASE_URL}/approve`, {
    appealID: appealId,
    remarks,
  });

// Reject appeal
export const rejectAppeal = (appealId, remarks) =>
  axios.put(`${APPEAL_BASE_URL}/reject`, {
    appealID: appealId,
    remarks,
  });