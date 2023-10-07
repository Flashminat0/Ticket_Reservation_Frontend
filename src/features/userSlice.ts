import {createSlice} from '@reduxjs/toolkit'

export type UserRoles = 'ADMIN' | 'BACKOFFICE' | 'TRAVEL_AGENT' | 'CUSTOMER' | 'UNREGISTERED'

export interface UserState {
    loggedIn: boolean,
    nic: string,
    isAdmin: boolean,
    userRoles?: UserRoles[]
}

const initialState: UserState = {
    loggedIn: false,
    nic: '',
    isAdmin: false,
    userRoles: ['UNREGISTERED']
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.loggedIn = action.payload.loggedIn
            state.nic = action.payload.nic
            state.isAdmin = action.payload.isAdmin
            state.userRoles = action.payload.userRoles
        },
        logout: (state) => {
            state.loggedIn = false
            state.nic = ''
            state.isAdmin = false
            state.userRoles = ['UNREGISTERED']
        }
    },
})

// Action creators are generated for each case reducer function
export const {login, logout} = userSlice.actions

export default userSlice.reducer