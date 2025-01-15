import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/form/FormInput';
import { useEffect } from 'react';

interface RegisterForm {
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
}

const schema = z
    .object({
        email: z.string().email('Invalid email address'),
        fullName: z.string().min(1, 'Full Name is required'),
        login: z.string().min(1, 'Login is required'),
        password: z.string().min(1, 'Password is required'),
        confirmPassword: z.string().min(1, 'Password Confirm is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(schema),
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { success, user, isLoading, error } = useSelector(
        (state: RootState) => state.auth,
    );

    const onSubmit = async (data: RegisterForm) => {
        dispatch(registerUser(data));
    };

    useEffect(() => {
        if (success) navigate('/login');
        if (user) navigate('/');
    }, [navigate, user, success]);

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                    Sign Up
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormInput
                        name={'login'}
                        type={'text'}
                        label={'Login'}
                        register={register}
                        errors={errors}
                    />
                    <FormInput
                        name={'fullName'}
                        type={'text'}
                        label={'Full Name'}
                        register={register}
                        errors={errors}
                    />
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
                    <FormInput
                        name={'confirmPassword'}
                        type={'password'}
                        label={'Confirm Password'}
                        register={register}
                        errors={errors}
                    />

                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
