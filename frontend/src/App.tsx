import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile/index';
import ForgotPassword from './pages/ForgotPassword';
import NoPage from './pages/NoPage';
import PasswordReset from './pages/PasswordReset';
import EditPost from './pages/EditPost';
import PrivateRoute from './components/PrivateRoute';
import EmailVerification from './pages/EmailVerification';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
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
                        <Route
                            path="/posts/:id"
                            element={
                                <PrivateRoute>
                                    <PostDetail />
                                </PrivateRoute>
                            }
                        />
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
