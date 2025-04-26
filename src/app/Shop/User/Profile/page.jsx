"use client"

import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });

  // Fetch the current user info on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/auth/me');
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          profilePicture: data.user.profilePicture || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser.user);
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while updating profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-6">
        <div className="flex items-center">
          <img
            src={user.profilePicture || '/default-profile.jpg'}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="profilePicture">
              Profile Picture URL
            </label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
