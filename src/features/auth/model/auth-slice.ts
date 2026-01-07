import { LoginInputs } from "@/features/auth/lib/schemas"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums"
import { authApi } from "@/features/auth/api/authApi.tsx"
import { AUTH_TOKEN } from "@/common/constants"
import { clearDataAC } from "@/common/actions"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userLogin: "",
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
    selectUserLogin: (state) => state.userLogin,
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.login(data)

          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return { isLoggedIn: true }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            localStorage.removeItem(AUTH_TOKEN)
            dispatch(clearDataAC())
            return { isLoggedIn: false }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.userLogin = ""
        },
      },
    ),
    initializeAppTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.me()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true, userLogin: res.data.data.login }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.userLogin = action.payload.userLogin
        },
      },
    ),
  }),
})

export const { selectIsLoggedIn, selectUserLogin } = authSlice.selectors
export const { loginTC, logoutTC, initializeAppTC } = authSlice.actions
export const authReducer = authSlice.reducer
