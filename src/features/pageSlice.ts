import {createSlice} from '@reduxjs/toolkit'

export interface PageState {
    title: string,
    item: number
}

const initialState: PageState = {
    title: 'Home',
    item: 0
}

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const {setTitle} = pageSlice.actions

export default pageSlice.reducer