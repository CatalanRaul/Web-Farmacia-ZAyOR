import { createSlice } from "@reduxjs/toolkit";



export const userSlice = createSlice({
  name: "user",
  initialState: {
    dataUser: [],
  },
  reducers: {
    setDataUser: (state, action) => {
      state.dataUser.push(action.payload);
      //inicialState = action.payload;
    },
  },
});

export const { setDataUser } = userSlice.actions;

export default userSlice.reducer;
