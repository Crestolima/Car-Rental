import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">Car Rental</Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/bookings" className="text-gray-700">My Bookings</Link>
                <Link to="/profile" className="text-gray-700">Profile</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700">Admin</Link>
                )}
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700">Login</Link>
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;