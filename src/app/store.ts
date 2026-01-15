import { configureStore } from "@reduxjs/toolkit"
import { appReducer, appSlice } from "./app-slice.ts"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "@/app/baseApi.ts"

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
setupListeners(store.dispatch)
