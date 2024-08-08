export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) {
        return false;
    }
    // Дополнительная проверка валидности токена может быть добавлена здесь
    return true;
};
