import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '../../store/slices/authSlice';
import FormInput from '../../components/form/FormInput';

const schema = z
    .object({
        password: z.string().min(1, 'Password is required'),
        confirmPassword: z.string().min(1, 'Confirm Password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

const PasswordReset = () => {
    const { token } = useParams();
    const { success, isLoading, user, error } = useSelector(
        (state) => state.auth,
    );
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [navigate, user]);

    const onSubmit = (data) => {
        dispatch(resetPassword({ token, password: data.password }));
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-20">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Reset Password
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        action="#"
                        method="POST"
                        className="space-y-6 text-left"
                        onSubmit={handleSubmit(onSubmit)}
                    >
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

                        <div className="text-sm">
                            Back to{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                Sign In
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {isLoading
                                    ? 'Reseting password...'
                                    : 'Reset password'}
                            </button>
                        </div>

                        {success && (
                            <div className="text-sm text-green-600 text-center">
                                Reset password successfully
                            </div>
                        )}
                        {error && (
                            <div className="text-sm text-red-600 text-center">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default PasswordReset;
