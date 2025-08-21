// src/services/api.js
import axios from 'axios'
// import { getCookie } from '@/composables/useCookies'
// import storage from '@/composables/useStorage'
// import { useAuthStore } from '@/stores/auth'
import router from "@/router"
// import { showAlert } from '@/composables/useAlert'


const instance = axios.create({
  isFile: false,
  baseURL: process.env.VUE_APP_SERVER_URL || 'https://dummyapi.example.com',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

// Request Interceptor
instance.interceptors.request.use((config) => {
  const token = getCookie('token')
  const locale = storage.get('locale')
  config.headers['Accept-language'] = locale

  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }

  if (config.isFile) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }

  return config
})

// Response Interceptor
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Unauthorized - 
      useAuthStore().flush();
      router.push({ name: "login" });
    } else if (status === 422) {
      // Validation error 
      const msg = error.response?.data?.message || "خطأ في البيانات المدخلة";
      showAlert(msg, "error");
    } else if (status >= 500) {
      showAlert("خطأ في السيرفر، حاول لاحقاً", "error");
    }

    return Promise.reject(error);
  }
);

export default instance
