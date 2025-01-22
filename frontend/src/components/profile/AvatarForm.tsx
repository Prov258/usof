import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { resetStatus, uploadAvatar } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/redux';
import { Button, FileInput, Group, Stack, Text } from '@mantine/core';

interface AvatarForm {
    avatar: File;
}

const schema = z.object({
    avatar: z.instanceof(File),
});

const AvatarForm = () => {
    const { isLoading, success, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<AvatarForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (success) {
            toast.success('Uploaded avatar successfully!');
            dispatch(resetStatus());
        }
    }, [dispatch, success]);

    useEffect(() => {
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    const onSubmit = async (data: AvatarForm) => {
        const formData = new FormData();
        formData.append('avatar', data.avatar);

        dispatch(uploadAvatar(formData));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
                <FileInput
                    label="Avatar"
                    placeholder="Select an image"
                    accept="image/*"
                    error={errors.avatar?.message}
                    onChange={(payload) => {
                        if (payload) {
                            setValue('avatar', payload);
                        }
                    }}
                    clearable
                    required
                />

                {error && <Text c="red">{error}</Text>}

                <Group justify="flex-end">
                    <Button type="submit" disabled={isLoading} mt="md">
                        {isLoading ? 'Saving..' : 'Save Changes'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};

export default AvatarForm;
