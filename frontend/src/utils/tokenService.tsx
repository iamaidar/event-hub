export const setToken = (access_token : string) => {
    localStorage.setItem("jwt_token", access_token);
};

export const getToken = () => {
    return localStorage.getItem("jwt_token");
};

export const removeToken = () => {
    localStorage.removeItem("jwt_token");
};