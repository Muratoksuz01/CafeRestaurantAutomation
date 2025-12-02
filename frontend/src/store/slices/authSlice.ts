import { API_PATHS } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// User tipi
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string
}

interface AuthState {
  user: User | null;
  // token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  // token: null,
  loading: false,
  error: null,
};

// Async thunk login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(API_PATHS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Giriş başarısız");
      }

      const data = await res.json(); // { user, token }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
// Async thunk login
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(API_PATHS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Giriş başarısız");
      }

      const data = await res.json(); // { user, token }
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    console.log("getuser calişti slice.ts");

    try {
      const token = localStorage.getItem("token")
      if (!token) return rejectWithValue("token yok");

      const res = await fetch(API_PATHS.getUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Kullanıcı bilgisi alınamadı");
      }

      const data = await res.json(); // { user }
      console.log("gelen veri getuser:", data.data);

      return data.data;
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
        console.log("slice:", action);
        state.user = action.payload.data.user;
        localStorage.setItem("user", JSON.stringify(action.payload.data.user))
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
        console.log(action.payload);

        if (action.payload.data.user) {
          state.user = action.payload.user;
          // state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.data.user))
          localStorage.setItem("token", action.payload.token);
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
        console.log(action.payload.user);  // burada doğru şekilde user gelir
        state.user = action.payload.user;  // sadece user'ı ata
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
