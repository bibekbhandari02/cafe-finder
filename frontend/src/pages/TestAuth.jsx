import { useAuth } from '../context/AuthContext';

const TestAuth = () => {
  const { user, loading } = useAuth();

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Auth Debug</h2>
        
        <div className="space-y-4">
          <div>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}
          </div>
          <div>
            <strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Not present'}
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear Storage & Reload
        </button>
      </div>
    </div>
  );
};

export default TestAuth;
