import { createSlice } from "@reduxjs/toolkit"
//initial state for auth
const initialState = {
    user: localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')) 
        : null, 

    isSidebarOpen: false,
};
//auth slice for redux
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{ 
        //actions
        setCredentials : (state, action) => {
            state.user = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        //logout for user
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('userInfo');
        },
        //set open sidebar for user
        setOpenSidebar: (state, action) => {
            state.isSidebarOpen = action.payload; 
        },
    },
});

export const { setCredentials, logout, setOpenSidebar} = authSlice.actions;

export default authSlice.reducer;