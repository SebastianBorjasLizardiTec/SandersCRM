import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Grid, Alert } from '@mui/material';
import '../styles/userWidgetStyles.css';
import { updateUserProfile } from '../Utilities/updateUserUtils';

interface UserProfileWidgetProps {
  open: boolean;
  onClose: () => void;
}

const UserProfileWidget: React.FC<UserProfileWidgetProps> = ({ open, onClose }) => {
  const [userId, setUserId] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('Stored userId:', storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    }
    // Retrieve other user details if needed
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const updateData = {
        userId,
        nombre: nombre || undefined,
        email: email || undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      };
      console.log('Update data:', updateData);
      const result = await updateUserProfile(updateData);
      setSuccessMessage(result);
      // Clear form fields after successful update
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      aria-labelledby="user-profile-dialog-title"
      className="user-profile-dialog"
    >
      <DialogTitle id="user-profile-dialog-title" className="user-profile-title">
        User Profile
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" style={{ marginBottom: '1rem' }}>
            {successMessage}
          </Alert>
        )}
        <form className="user-profile-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Typography gutterBottom>
            Manage your profile information here.
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography>Name:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                placeholder="John Doe"
                type="text"
                fullWidth
                variant="outlined"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography>Email:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                margin="dense"
                id="email"
                placeholder="johndoe@example.com"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography>Current Password:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                margin="dense"
                id="currentPassword"
                placeholder="********"
                type="password"
                fullWidth
                variant="outlined"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography>New Password:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                margin="dense"
                id="newPassword"
                placeholder="********"
                type="password"
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="user-profile-button">
          Close
        </Button>
        <Button onClick={handleSubmit} className="user-profile-button">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileWidget;
