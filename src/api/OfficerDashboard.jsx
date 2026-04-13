import api from "./api"; // 1. Import uncommented

export const OfficerDashboardCount = async (officerId) => {
    try {
        // 2. Typo removed. 
        // 3. Base_URL removed because api.js already adds "https://localhost:7027/api" automatically!
        const response = await api.get(`/Case/dashboard/${officerId}`);
        
        // 4. Return response directly (Because your api.js interceptor already extracts .data)
        return response; 
    } catch (error) {
        throw error;
    }
};