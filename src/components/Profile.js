import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';
import API_BASE_URL from '../config/api';

const Profile = () => {
  const {
    currentUserId,
    currentUserName,
    currentUserEmail,
    currentUserProfileImage,
    login,
  } = useContext(UserContext);

  const [updatedName, setUpdatedName] = useState(currentUserName || '');
  const [updatedBio, setUpdatedBio] = useState('');
  const [updatedProfileImage, setUpdatedProfileImage] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUserName) setUpdatedName(currentUserName);
  }, [currentUserName]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setError('');

    if (file && file.type.startsWith('image/')) {
      setUpdatedProfileImage(file);
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');

    if (!updatedName) {
      setError('Name is required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', currentUserId);
      formData.append('name', updatedName);
      formData.append('email', currentUserEmail);
      formData.append('bio', updatedBio);
      if (updatedProfileImage) {
        formData.append('profileImage', updatedProfileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/update-profile`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        let profileImageUrl = data.user.profile.profileImage;
        if (!profileImageUrl) {
          profileImageUrl = imag;
        }

        login(
          currentUserId,
          currentUserEmail,
          updatedName,
          profileImageUrl,
          data.user.latitude,
          data.user.longitude
        );
        setStatus('Profile updated successfully.');
      } else {
        setError('Unable to update profile.');
      }
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong while updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserId) {
    return (
      <main className="page page--narrow">
        <div className="empty-state">
          <h2>Login required</h2>
          <p>Please login before updating your profile.</p>
        </div>
      </main>
    );
  }

  const previewImage = updatedProfileImage
    ? URL.createObjectURL(updatedProfileImage)
    : currentUserProfileImage || imag;

  return (
    <main className="page page--narrow">
      <div className="page-header">
        <p className="eyebrow">Account</p>
        <h1 className="page-title">Your profile</h1>
        <p className="page-copy">Keep your display name and profile image current for rentals and listings.</p>
      </div>

      <form onSubmit={handleSubmit} className="panel-card">
        <div className="panel-card__body">
          {status && <div className="status-banner status-banner--success mb-3">{status}</div>}
          {error && <div className="status-banner status-banner--error mb-3">{error}</div>}

          <div className="d-flex align-items-center gap-3 mb-4">
            <img src={previewImage} alt="" className="avatar" />
            <div>
              <strong>{currentUserName || 'ToolNet user'}</strong>
              <p className="mb-0 text-muted">{currentUserEmail}</p>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="profile-name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="profile-name"
              value={updatedName}
              onChange={(event) => setUpdatedName(event.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="profile-email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="profile-email"
              value={currentUserEmail || ''}
              disabled
            />
          </div>

          <div className="mb-3">
            <label htmlFor="profile-bio" className="form-label">Bio</label>
            <textarea
              className="form-control"
              id="profile-bio"
              rows="4"
              value={updatedBio}
              onChange={(event) => setUpdatedBio(event.target.value)}
              placeholder="Write something about yourself"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="profile-image" className="form-label">Profile image</label>
            <input
              type="file"
              className="form-control"
              id="profile-image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Updating...' : 'Update profile'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Profile;
