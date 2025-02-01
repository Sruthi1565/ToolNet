import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';

const Profile = () => {
  const { currentUserId, currentUserName, currentUserEmail, login } = useContext(UserContext);
  const navigate = useNavigate();

  const [updatedName, setUpdatedName] = useState(currentUserName || '');
  const [updatedBio, setUpdatedBio] = useState('');
  const [updatedProfileImage, setUpdatedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUserName) setUpdatedName(currentUserName);
  }, [currentUserName]);

  // Handle file input for profile image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUpdatedProfileImage(file);
      console.log('Selected profile image:', file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedName) {
        alert('Please fill in the name field.');
        return;
    }

    setLoading(true);
    console.log('Submitting profile update with name:', updatedName);
    console.log('Updated bio:', updatedBio);
    console.log('Updated profile image:', updatedProfileImage);

    try {
        const formData = new FormData();
        formData.append('userId', currentUserId);
        formData.append('name', updatedName);
        formData.append('email', currentUserEmail);
        formData.append('bio', updatedBio);
        if (updatedProfileImage) {
            formData.append('profileImage', updatedProfileImage);
        }

        console.log('Form data prepared:', formData);

        const response = await axios.put('http://localhost:5000/api/update-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Full response from API:', response.data); // Log the full response

        if (response.data.success) {
          alert('Profile updated successfully');
          
          let profileImageUrl = response.data.user.profile.profileImage;
          console.log("profile image url"+profileImageUrl);
          if (!profileImageUrl) {
            console.warn('Profile image not available in the response.');
            profileImageUrl = imag; // Default image
          }
        
          // Update context with the new profile image URL
          login(currentUserId, currentUserEmail, updatedName, profileImageUrl, response.data.user.latitude, response.data.user.longitude);
        
        } else {
            alert('Error updating profile');
        }
    } catch (error) {
        console.error(error);
        alert('Something went wrong while updating your profile');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Update Your Profile</h2>

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm border border-info">
        <div className="mb-3">
          <label htmlFor="name" className="form-label text-secondary">Name</label>
          <input
            type="text"
            className="form-control border-2"
            id="name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label text-secondary">Email</label>
          <input
            type="email"
            className="form-control border-2"
            id="email"
            value={currentUserEmail}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label text-secondary">Bio</label>
          <textarea
            className="form-control border-2"
            id="bio"
            rows="3"
            value={updatedBio}
            onChange={(e) => setUpdatedBio(e.target.value)}
            placeholder="Write something about yourself"
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="profileImage" className="form-label text-secondary">Profile Image</label>
          <input
            type="file"
            className="form-control border-2"
            id="profileImage"
            onChange={handleFileChange}
          />
          {updatedProfileImage && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(updatedProfileImage)}
                alt="Profile Preview"
                className="rounded-circle border border-3 border-primary"
                width="120"
                height="120"
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
