import { changeStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { isAxiosError } from "axios"

export const handleCatchErrors = (error: unknown, dispatch: Dispatch) => {
  if (isAxiosError(error)) {
    dispatch(setErrorAC({ error: error.response?.data?.message || error.message }))
  } else if (error instanceof Error) {
    dispatch(setErrorAC({ error: error.message }))
  } else {
    dispatch(setErrorAC({ error: "Something went wrong" }))
  }

  dispatch(changeStatusAC({ status: "failed" }))
}
