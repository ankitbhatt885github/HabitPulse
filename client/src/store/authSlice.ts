import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

//user will have these values
interface User {
  _id: string;
  name: string;
  email: string;
}

//auth state can have a user and is he logged in or not hence authenticated
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

//initally no user and logged out
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

//so this slice has two reducer function setUser and clearUser
const authSlice = createSlice({
    name: "auth", //name of this slice
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
      state.isAuthenticated = true;
        },
        //when we dispatch we do: dispatch(setUser(user)), action.payload will be the user

        clearUser: (state) => {
            state.user = null;
      state.isAuthenticated = false;
        }
    }
})

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;