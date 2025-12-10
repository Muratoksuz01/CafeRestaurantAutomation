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
 // role?: string
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
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      // state.token = null;
      state.loading = false;
      state.error = null;
      state.user=null
      state.token=null
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
       // state.user?.role=getRole(action.payload.data.token)
         state.token = action.payload.data.token;  // <-- sadece state'e yaz

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
      //  console.log(action.payload);

        if (action.payload.data.user) {
          state.user = action.payload.data.user;
          localStorage.setItem("token", action.payload.data.token);
        }

      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getUser
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      //  console.log("getuser slice gelen user degeri:", action || "bos deger ");  // burada doğru şekilde user gelir
        state.user = action.payload.data.user;  // sadece user'ı ata
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
      //  console.log("getuser slice gelen action degeri:", action.payload as string)
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
