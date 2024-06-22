import { apiSlice } from '../apiSlice'

const DASHBOARD_URL = "/dashboard"

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getDashboard: builder.query({
            query: () => ({
                url: `${DASHBOARD_URL}/`,
                method: 'GET',
                credentials: "include",
            })
        })

    })

})

export const { useGetDashboardQuery } = dashboardApiSlice;