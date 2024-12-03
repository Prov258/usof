import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, PlusSquare, User, LogOut } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-indigo-600">
                            TellMe
                        </div>
                    </Link>

                    {/* <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div> */}

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to="/create-post"
                                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                                >
                                    <PlusSquare className="h-5 w-5" />
                                    <span>Ask Question</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={`http://localhost:3000${user.avatar}`}
                                            alt={user.login}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                    <span>{user.login}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                >
                                    Sign up
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
