import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../interfaces/user";
import { RootState } from "./store";

const API = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Can't download users");
      }
      return (await response.json()) as User[];
    } catch (error) {
      return rejectWithValue("Can't download users");
    }
  }
);

interface UserState {
  users: User[];
  filterType: {
    name: string;
    username: string;
    email: string;
    phone: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  filterType: {
    name: "",
    username: "",
    email: "",
    phone: "",
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFilterType: (
      state,
      action: PayloadAction<{ field: keyof UserState['filterType']; value: string }>
    ) => {
      state.filterType[action.payload.field as keyof UserState["filterType"]] =
        state.filterType[action.payload.field] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilterType } = userSlice.actions;

export const selectUsers = (state: RootState) => state.userReducer.users;
export const selectFilter = (state: RootState) => state.userReducer.filterType;
export const selectLoading = (state: RootState) => state.userReducer.loading;
export const selectError = (state: RootState) => state.userReducer.error;

export default userSlice.reducer;
