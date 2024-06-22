//libraries
import { apiSlice } from "../apiSlice";

const TASK_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({ 
    endpoints: (builder) => ({

        getTask: builder.query({
            query: () => ({
                url: `${TASK_URL}/`,
                method: 'GET',
                credentials: "include",
            })
        }),

        createTask: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/create`,
                method: 'POST',
                body: data,
                credentials: "include",
            })
        }),

        updateTask: builder.mutation({
            query: ({ _id, ...data }) => ({
                url: `${TASK_URL}/update/${_id}`,
                method: 'PUT',
                body: data,
                credentials: "include",
            })
        }),

        deleteTask: builder.mutation({ 
            query: ({_id}) => ({
                url: `${TASK_URL}/delete/${_id}`,
                method: 'DELETE',
                credentials: "include",
            })
        }),

        doneTask: builder.mutation({
            query: ({ _id }) => ({
                url: `${TASK_URL}/task-done/${_id}`,
                method: 'PUT',
                body: { status: "Complete" },
                credentials: "include",
            })
        }),

        getTaskID: builder.query({
            query: ({ _id }) => ({
                url: `${TASK_URL}/getTaskID/${_id}`,
                method: 'GET',
                credentials: "include",
            })
        })

    })

})

export const { useGetTaskQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, useDoneTaskMutation, useGetTaskIDQuery } = taskApiSlice;