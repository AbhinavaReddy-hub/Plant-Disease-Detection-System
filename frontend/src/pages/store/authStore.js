import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:8090/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name, selectedDistrict) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`http://localhost:5000/api/auth/signup`, {
				email,
				password,
				name,
				location: selectedDistrict
			},
				{
					withCredentials: true  // Send cookies and credentials with the request
				});

			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			// Log full error details for better debugging
			console.error("Error signing up:", error);
			set({ error: error.response ? error.response.data.message : "Error signing up", isLoading: false });
			throw error; // Re-throw to allow frontend to catch and show the error
		}
	}
	,
	login: async (username, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post("http://localhost:5000/api/auth/login", { username, password }, { withCredentials: true });
			if (response.data.success) {
				set({
					user: response.data.user,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				});
			} else {
				throw new Error(response.data.message);
			}

		} catch (error) {
			set({ isLoading: false, error: error.message || "Error logging in" });
			throw error;
		}
	},


	googlelogin: async () => {
		set({ isLoading: true, error: null });
		try {
			set({
				isAuthenticated: true,
				error: null,
				isLoading: false,
			});
			console.log(isAuthenticated);
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},


	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	// checkAuth: async () => {
	// 	set({ isCheckingAuth: true, error: null });
	// 	try {
	// 	  const response = await axios.get(`http://localhost:5000/api/auth/check-auth`);
	// 	  console.log("Auth check response:", response); // Debugging line
	// 	  set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
	// 	} catch (error) {
	// 	  console.error("Auth check error:", error); // Debugging line
	// 	  set({ isCheckingAuth: false, isAuthenticated: false, error: null });
	// 	}
	//   },
	checkAuth: async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/auth/check-auth", { withCredentials: true });
			set({ user: response.data.user, isAuthenticated: true });
		} catch (error) {
			set({ isAuthenticated: false });
		} finally {
			set({ isCheckingAuth: false });
		}
	},


	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
