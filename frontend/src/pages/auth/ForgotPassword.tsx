import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPassword } from '../../store/slices/authSlice';
import FormInput from '../../components/form/FormInput';
import { useAppDispatch } from '../../hooks/redux';
import { RootState } from '../../store';

export interface ForgotPasswordForm {
    email: string;
}

const schema = z.object({
    email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
    const { success, isLoading, user, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [navigate, user]);

    const onSubmit = (data: ForgotPasswordForm) => {
        dispatch(forgotPassword(data));
    };

    return (
        <>
            <div className="max-w-md mx-auto mt-20">
                <div className="bg-white pb-10 rounded-lg shadow-md">
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8 ">
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
                                    name={'email'}
                                    type={'email'}
                                    label={'Email address'}
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
                                        disabled={isLoading}
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {isLoading
                                            ? 'Sending Email...'
                                            : 'Send Email'}
                                    </button>
                                </div>

                                {success && (
                                    <div className="text-sm text-green-600 text-center">
                                        Email Sent
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
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
