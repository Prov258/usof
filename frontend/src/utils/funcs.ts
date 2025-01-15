export const url = (path: string) => {
    return `${import.meta.env.VITE_SERVER_URL}${path}`;
};
