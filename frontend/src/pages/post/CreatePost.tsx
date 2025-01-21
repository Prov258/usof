import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePostMutation } from '../../services/postApi';
import {
    Button,
    Container,
    Group,
    Paper,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import CategorySelect from '../../components/form/CategorySelect';

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
    const [createPost, { isLoading, isSuccess, isError }] =
        useCreatePostMutation();
    const {
        setValue,
        register,
        handleSubmit,
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
        <Container size="sm">
            <Paper withBorder shadow="sm" radius="md" p="xl">
                <Title order={3} mb="md" ta="center">
                    Create Post
                </Title>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
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
                            onChange={(value) =>
                                setValue('categories', value.categories)
                            }
                            error={errors.categories?.message}
                        />

                        {isError && <Text c="red">Error occurred</Text>}

                        <Group justify="flex-end">
                            <Button type="submit" disabled={isLoading} mt="md">
                                {isLoading ? 'Posting...' : 'Post Question'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default CreatePost;
