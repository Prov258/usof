import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import CategorySelect from '../../components/form/CategorySelect';
import type { RootState } from '../../store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useGetPostByIdQuery,
    useUpdatePostMutation,
} from '../../services/postApi';
import {
    Button,
    Center,
    Container,
    Group,
    Loader,
    Paper,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';

interface EditPostForm {
    title: string;
    content: string;
    categories: string[];
    status: 'active' | 'inactive';
}

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    categories: z.array(z.any()),
});

const EditPost = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [updatePost, { isLoading: isUpdating, isSuccess, isError }] =
        useUpdatePostMutation();
    const { data: currentPost, isLoading } = useGetPostByIdQuery(id ?? '');

    const {
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditPostForm>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (currentPost) {
            reset({
                title: currentPost.title,
                content: currentPost.content,
                categories: currentPost.categories.map((c) => c.title),
            });
        }
    }, [currentPost, reset]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Edited post successfully!');
        }
    }, [isSuccess]);

    const onSubmit = async (data: EditPostForm) => {
        if (currentPost) {
            await updatePost({ id: currentPost.id, ...data });
        }
    };

    if (isLoading) {
        return (
            <Center h="200">
                <Loader color="blue" size="lg" />
            </Center>
        );
    }

    if (!currentPost || !user || currentPost.author.id !== user.id) {
        return (
            <Center h="200">
                <Text c="red" size="xl" fw={700}>
                    You don't have permission to edit this post
                </Text>
            </Center>
        );
    }

    return (
        <Container size="sm">
            <Paper withBorder shadow="sm" radius="md" p="xl">
                <Title order={3} mb="md" ta="center">
                    Edit Post
                </Title>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        {...register('title')}
                        label="Title"
                        placeholder="What's your question?"
                        error={errors.title?.message}
                        required
                    />
                    <Textarea
                        {...register('content')}
                        error={errors.content?.message}
                        withAsterisk
                        label="Content"
                        placeholder="Describe your question in detail..."
                        autosize
                        minRows={5}
                        maxRows={10}
                        required
                    />

                    <CategorySelect
                        selectedCategories={currentPost.categories}
                        onChange={(value) =>
                            setValue('categories', value.categories)
                        }
                        error={errors.categories?.message}
                    />

                    {isError && <Text c="red">Error occurred</Text>}

                    <Group justify="flex-end">
                        <Button type="submit" disabled={isUpdating} mt="md">
                            {isUpdating ? 'Saving...' : 'Save'}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
};

export default EditPost;
