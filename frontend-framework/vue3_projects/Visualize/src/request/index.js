import axios from 'axios';

const url =
  import.meta.env.MODE === 'development' ? '/api' : 'http://localhost:3000';

const request = axios.create({
  baseURL: url,
  timeout: 5000,
});

request.interceptors.request.use((config) => {
  return config;
});
request.interceptors.response.use(
  (res) => {
    if (res.data.code !== 0) {
      console.log(res.data.msg);
    }

    return res.data;
  },
  (err) => {
    console.log(err);
  }
);

export default request;
