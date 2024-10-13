import axios from 'axios';
import { API_URL } from '../constants/constants';

interface UpdateUserData {
  userId: string;
  nombre?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateUserProfile = async (userData: UpdateUserData): Promise<string> => {
  console.log('Received userData:', userData);

  if (!userData.userId) {
    throw new Error('User ID is missing');
  }

  try {
    const response = await axios.put(`${API_URL}/api/user/update`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('Server response:', response.data);

    if (response.status === 200) {
      return 'Profile updated successfully';
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server error response:', error.response.data);
      switch (error.response.status) {
        case 400:
          if (error.response.data.message === 'Invalid userId format') {
            throw new Error('Our mistake, please try again');
          } else if (error.response.data.message === 'Both current and new password are required to change password') {
            throw new Error('Both current and new password are required to change password');
          } else if (error.response.data.message === 'No valid fields to update') {
            throw new Error('No changes were made to update');
          } else {
            throw new Error(error.response.data.message || 'Bad request');
          }
        case 401:
          throw new Error('Invalid current password');
        case 404:
          throw new Error('User not found');
        case 500:
          throw new Error('Internal server error');
        default:
          throw new Error('An unexpected error occurred');
      }
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
