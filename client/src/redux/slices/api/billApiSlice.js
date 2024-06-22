import { apiSlice } from "../apiSlice";

const BILL_URL = "/bill";

export const billApiSlice = apiSlice.injectEndpoints({ 
    endpoints: (builder) => ({

        getBill: builder.query({
            query: () => ({
                url: `${BILL_URL}/`,
                method: 'GET',
                credentials: "include",
            })
        }),

        createBill: builder.mutation({
            query: (data) => ({
                url: `${BILL_URL}/create`,
                method: 'POST',
                body: data,
                credentials: "include",
            })
        }),

        updateBill: builder.mutation({
            query: ({_id, ...data}) => ({
                url: `${BILL_URL}/update/${_id}`,
                method: 'PUT',
                body: data,
                credentials: "include",
            })
        }),

        deleteBill: builder.mutation({ 
            query: ({_id}) => ({
                url: `${BILL_URL}/delete/${_id}`,
                method: 'DELETE',
                credentials: "include",
            })
        }),

        paidBill : builder.mutation({ 
            query: ({_id}) => ({
                url: `${BILL_URL}/bill-paid/${_id}`,
                method: 'PUT',
                body: { status: "Paid" },
                credentials: "include",
            })
        }),

        getBillID: builder.query({
            query: ({_id}) => ({
                url: `${BILL_URL}/getBillID/${_id}`,
                method: 'GET',
                credentials: "include",
            })
        })

    })
})

export const { useGetBillQuery, useCreateBillMutation, useUpdateBillMutation, useDeleteBillMutation, usePaidBillMutation, useGetBillIDQuery } = billApiSlice;