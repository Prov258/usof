import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import type { RootState } from '../store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import { useEffect } from 'react';

interface LoginForm {
    email: string;
    password: string;
}

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error } = useSelector(
        (state: RootState) => state.auth,
    );

    const onSubmit = async (data: LoginForm) => {
        dispatch(login(data));
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [navigate, user]);

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormInput
                        name={'email'}
                        type={'email'}
                        label={'Email'}
                        register={register}
                        errors={errors}
                    />
                    <FormInput
                        name={'password'}
                        type={'password'}
                        label={'Password'}
                        register={register}
                        errors={errors}
                    />

                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <div className="text-sm">
                        <Link
                            to="/forgot-password"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
