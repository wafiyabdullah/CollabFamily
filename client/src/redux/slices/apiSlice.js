import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

//api uri for backend
const API_URI = 'https://collab-family-server.vercel.app/api';

//base query for api
const baseQuery = fetchBaseQuery({
    baseUrl: API_URI,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  });
  
//api slice for redux
export const apiSlice = createApi ({
    baseQuery,
    tagTypes: [],
    endpoints: (builder) => ({}),
});

