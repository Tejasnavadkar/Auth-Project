import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL
})

axiosInstance.interceptors.request.use( // here pass token for every request
    (config)=>{
        const AccessToken = localStorage.getItem('AccessToken') || '';
       if(AccessToken){
         config.headers.Authorization = `Bearer ${AccessToken}`
       }
        return config

    },
    (error)=>{
         // Do something with request error
        return Promise.reject(error)
    }
)

export default axiosInstance








// Alternative Approaches
// Selective Header Inclusion:
// You can create multiple Axios instances, each with different configurations, to handle different types of requests.
// Conditional Header Inclusion:
// Modify the interceptor to conditionally add headers based on the request's properties.
// Example: Multiple Axios Instances
// import axios from 'axios';

// // Instance with headers
// const instanceWithHeaders = axios.create({
//   baseURL: 'https://some-domain.com/api/',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
// });

// instanceWithHeaders.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');
//     const language = localStorage.getItem('language') || 'en';
//     if (accessToken) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }
//     config.headers['Accept-Language'] = language;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Instance without headers
// const instanceWithoutHeaders = axios.create({
//   baseURL: 'https://some-domain.com/api/',
//   timeout: 1000
// });

// // Usage
// instanceWithHeaders.get('/user')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });

// instanceWithoutHeaders.get('/public-data')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
// Example: Conditional Header Inclusion
// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'https://some-domain.com/api/',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
// });

// instance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');
//     const language = localStorage.getItem('language') || 'en';
//     if (accessToken && !config.url.includes('/public-data')) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }
//     if (!config.url.includes('/public-data')) {
//       config.headers['Accept-Language'] = language;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Usage
// instance.get('/user')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });

// instance.get('/public-data')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
// Summary
// Multiple Instances: Use this approach when you have distinct types of requests that require different configurations.
// Conditional Headers: Use this approach when you want to include headers based on specific conditions, such as the request URL.
// Both methods allow you to avoid sending unnecessary headers, making your application more efficient and secure.