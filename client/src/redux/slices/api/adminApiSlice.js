import { apiSlice } from "../apiSlice";

const ADMIN_URL = "/admin";

export const adminApiSlice = apiSlice.injectEndpoints({ 
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => ({
                url: `${ADMIN_URL}/adminNotifications`,
                method: 'GET',
                credentials: "include",
            })
        })

    })
});

export const { useGetNotificationsQuery } = adminApiSlice;