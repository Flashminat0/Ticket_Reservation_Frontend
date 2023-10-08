import { configureStore } from '@reduxjs/toolkit'

import userReducer from "./userSlice.ts";
import pageReducer from "./pageSlice.ts";

export const store = configureStore({
    reducer: {
        user: userReducer,
        page: pageReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch