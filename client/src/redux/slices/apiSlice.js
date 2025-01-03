import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

//api uri for backend
const API_URI = '/api';

//base query for api
const baseQuery = fetchBaseQuery({ baseUrl: API_URI });

//api slice for redux
export const apiSlice = createApi ({
    baseQuery,
    tagTypes: [],
    endpoints: (builder) => ({}),
});

