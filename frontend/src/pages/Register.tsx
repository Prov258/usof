import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/auth/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { registerUser } from '../redux/auth/authActions';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z
    .object({
        email: z.string().email('Invalid email address'),
        fullName: z.string().nullish(),
        login: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

const Register = () => {
    const { loading, userInfo, error, success } = useSelector(
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

    const submitForm = (data) => {
        dispatch(registerUser(data));
    };

    const navigate = useNavigate();

    useEffect(() => {
        // redirect user to login page if registration was successful
        if (success) navigate('/login');
        // redirect authenticated user to profile screen
        if (userInfo) navigate('/');
    }, [navigate, userInfo, success]);

    return (
        <>
            {/*
              This example requires updating your template:
      
              ```
              <html class="h-full bg-white">
              <body class="h-full">
              ```
            */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Register
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-left">
                    <form
                        action="#"
                        method="POST"
                        className="space-y-6"
                        onSubmit={handleSubmit(submitForm)}
                    >
                        <FormInput
                            name={'email'}
                            type={'email'}
                            label={'Email address'}
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
                            name={'login'}
                            type={'text'}
                            label={'Login'}
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

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register
                            </button>
                        </div>

                        {error && <p>{error}</p>}
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Already have an account?{' '}
                        <Link
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                            to="/login"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;
