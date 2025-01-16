import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CategorySelect from '../../components/CategorySelect';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/form/FormInput';
import FormArea from '../../components/form/FormArea';
import { useCreatePostMutation } from '../../services/postApi';

interface CreatePostForm {
    title: string;
    content: string;
    categories: string[];
}

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    categories: z.array(z.string()),
});

const CreatePost = () => {
    const [createPost, { isLoading, isSuccess, error }] =
        useCreatePostMutation();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreatePostForm>({
        resolver: zodResolver(schema),
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            navigate('/');
        }
    }, [isSuccess, navigate]);

    const onSubmit = async (data: CreatePostForm) => {
        await createPost(data);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Ask a Question
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormInput
                        name={'title'}
                        type={'text'}
                        label={'Title'}
                        register={register}
                        errors={errors}
                    />
                    <FormArea
                        name={'content'}
                        label={'Content'}
                        rows={10}
                        placeholder={
                            'Include all the information someone would need to answer your question'
                        }
                        register={register}
                        errors={errors}
                    />
                    <CategorySelect
                        control={control}
                        error={errors.categories?.message}
                    />

                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error.data}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Posting...' : 'Post Your Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
