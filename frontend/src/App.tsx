import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PostDetail from './pages/post/PostDetail';
import CreatePost from './pages/post/CreatePost';
import Profile from './pages/profile/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import NoPage from './pages/NoPage';
import PasswordReset from './pages/auth/PasswordReset';
import EditPost from './pages/post/EditPost';
import PrivateRoute from './components/PrivateRoute';
import EmailVerification from './pages/auth/EmailVerification';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/password-reset/:token"
                            element={<PasswordReset />}
                        />
                        <Route
                            path="/email-verification"
                            element={<EmailVerification />}
                        />
                        <Route path="/posts/:id" element={<PostDetail />} />
                        <Route
                            path="/create-post"
                            element={
                                <PrivateRoute>
                                    <CreatePost />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/posts/:id/edit"
                            element={
                                <PrivateRoute>
                                    <EditPost />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NoPage />} />
                    </Routes>
                </main>
                <Toaster position="top-center" />
            </div>
        </Router>
    );
};

export default App;
