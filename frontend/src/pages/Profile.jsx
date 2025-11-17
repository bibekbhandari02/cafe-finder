import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">My Profile</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
            <p className="text-lg font-semibold dark:text-white">{user.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <p className="text-lg dark:text-white">{user.email}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Account Actions</h2>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;