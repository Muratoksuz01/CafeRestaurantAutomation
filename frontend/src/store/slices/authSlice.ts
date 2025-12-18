import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { getRole } from "@/lib/utils";
import { RegisterForm } from "@/models/User";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// User tipi
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  permissions: string[]
  role?: string

}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
 
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,

};

// Async thunk login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_PATHS.login, credentials)
      let data = res.data;
      if (data.success && !data.data) {
        return rejectWithValue(data.message);
      } else if (data.success && data.data) {
        return data
      }

    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
// Async thunk login
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials: RegisterForm, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_PATHS.register, credentials, {
        headers: { "Content-Type": "application/json" }
      });

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Giriş başarısız");
      }
      // console.log(res.data);

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }

  }
);

export const getPermission = createAsyncThunk(
  "auth/getPermission",
  async (_, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("token")
      if (token) {
        const res = await axiosInstance.get(API_PATHS.permission)
        if (res.data.success) {
          return res.data.data
        } else {
          return rejectWithValue(res.data.message)
        }
      } else {
        console.log("token yok");
        return rejectWithValue("toen yok ")
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      // state.token = null;
      state.loading = false;
      state.error = null;
      state.user = null
      state.token = null
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      //loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // console.log("slice:", action);
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data.token;
        localStorage.setItem("token", action.payload.data.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload.data.user) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          localStorage.setItem("token", action.payload.data.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getPermission
      .addCase(getPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPermission.fulfilled, (state, action: PayloadAction<any>) => {
        console.log("slice daki payload:",action.payload);
        state.loading = false;
        if (state.user) {
          state.user.permissions = action.payload;
        }
      })
      .addCase(getPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

/*
export const getUser = createAsyncThunk(
 "auth/getUser",
 async (_, { rejectWithValue }) => {
   //   console.log("getuser calişti slice.ts");

   try {
     const token = localStorage.getItem("token")
     if (!token) {
       console.log("token yok");
       return rejectWithValue("toen yok ")

     }

     const response = await axiosInstance.get(API_PATHS.getUser, {
       headers: { Authorization: `Bearer ${token}` },
     })
     if (response.data.success && response.data.data) {
       //  console.log("istek sonrası gonderlie degr:", response.data);

       return response.data
     } else {
       return rejectWithValue(response.data.message)
     }

   } catch (err: any) {
     return rejectWithValue(err.message);
   }
 }
);
// getUser
     .addCase(getUser.pending, (state) => {
       state.loading = true;
       state.error = null;
     })
     .addCase(getUser.fulfilled, (state, action: PayloadAction<any>) => {
       state.loading = false;
       state.user = action.payload.data.user;  // sadece user'ı ata
     })
     .addCase(getUser.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
     }) */