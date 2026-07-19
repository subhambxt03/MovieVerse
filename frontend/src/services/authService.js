import api from './api';

const authService = {
  register: async (name, email, password) => {
    console.log('📝 authService: Registering user...', { name, email });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      console.log('✅ authService: Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Registration error:', error.response?.data);
      throw error;
    }
  },

  login: async (email, password) => {
    console.log('🔐 authService: Logging in...', { email });
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ authService: Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Login error:', error.response?.data);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      console.log('✅ authService: Logged out successfully');
    } catch (error) {
      console.error('❌ authService: Logout error:', error);
    }
  },

  getProfile: async () => {
    console.log('👤 authService: Fetching profile...');
    try {
      const response = await api.get('/user/profile');
      console.log('✅ authService: Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Get profile error:', error.response?.data);
      throw error;
    }
  },

  updateProfile: async (data) => {
    console.log('✏️ authService: Updating profile...', data);
    try {
      const response = await api.put('/user/profile', data);
      console.log('✅ authService: Update profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Update profile error:', error.response?.data);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    console.log('🔑 authService: Changing password...');
    try {
      const response = await api.post('/user/change-password', { 
        current_password: currentPassword, 
        new_password: newPassword 
      });
      console.log('✅ authService: Change password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Change password error:', error.response?.data);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    console.log('📧 authService: Sending forgot password request for:', email);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      console.log('✅ authService: Forgot password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Forgot password error:', error.response?.data);
      throw error;
    }
  },

  resetPasswordDirect: async (email, newPassword, confirmPassword) => {
    console.log('🔑 authService: Direct password reset for:', email);
    try {
      const response = await api.post('/auth/reset-password-direct', { 
        email, 
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      console.log('✅ authService: Reset response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Reset error:', error.response?.data);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    console.log('🔑 authService: Resetting password with token:', token.substring(0, 20) + '...');
    try {
      const response = await api.post('/auth/reset-password', { 
        token: token, 
        new_password: newPassword 
      });
      console.log('✅ authService: Reset password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService: Reset password error:', error.response?.data);
      throw error;
    }
  },
};

export default authService;