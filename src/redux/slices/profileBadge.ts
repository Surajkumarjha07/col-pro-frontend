import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    isProfileBadgeOpen: false
}

export const ProfileBadgeSlice = createSlice({
    initialState,
    name: "ProfielBadge",
    reducers: {
        setOpenProfileBadge: (state, action: PayloadAction<boolean>) => {
            state.isProfileBadgeOpen = action.payload;
            console.log("HEHHEH")
        }
    }
})

export const { setOpenProfileBadge } = ProfileBadgeSlice.actions;
export default ProfileBadgeSlice.reducer;