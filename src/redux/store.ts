import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "./slices/user";
import ProfileBadgeReducer from "./slices/profileBadge";

export const store = configureStore({
  reducer: {
    User: UserReducer,
    ProfileBadgeState: ProfileBadgeReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch