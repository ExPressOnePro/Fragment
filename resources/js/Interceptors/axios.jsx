// // src/axiosInstance.js
// import axios from 'axios';
//
// const axiosInstance = axios.create({
//     baseURL: '/api',
// });
//
// axiosInstance.interceptors.request.use(config => {
//     // Получаем токен из localStorage
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });
//
// export default axiosInstance;
