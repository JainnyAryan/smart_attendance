let navigateFunction = null;

export const setNavigate = (navigate) => {
    navigateFunction = navigate;
};

export const redirectToLogin = () => {
    if (navigateFunction) {
        navigateFunction('/login', { replace: true });
    }
};