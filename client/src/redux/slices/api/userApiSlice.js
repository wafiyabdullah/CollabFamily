import { apiSlice } from '../apiSlice'

const USER_URL = "/user"

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({ 

        addFamily : builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/register-family`,
                method: 'PUT',
                body: data,
                credentials: "include",
            })
        }),

        updateUser : builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`,
                method: 'PUT',
                body: data,
                credentials: "include",
            })
        }),

        getFamilyList : builder.query({
            query: () => ({
                url: `${USER_URL}/get-family`,
                method: 'GET',
                credentials: "include",
            })
        }),

        changePassword : builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/change-password`,
                method: 'PUT',
                body: data,
                credentials: "include",
            })
        
        }),

        registerFamily : builder.mutation({ 
            query: (data) => ({
                url: `${USER_URL}/register-family`,
                method: 'PUT',
                body: data,
                credentials: "include",
            })
        }),

        removeFamilyMember : builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/remove-family-member`,
                method: 'DELETE',
                body: { id },
                credentials: "include",
            })
        }),


    })
})

export const { 
    useAddFamilyMutation, 
    useUpdateUserMutation, 
    useGetFamilyListQuery, 
    useChangePasswordMutation,
    useRegisterFamilyMutation,
    useRemoveFamilyMemberMutation,
} = userApiSlice; 