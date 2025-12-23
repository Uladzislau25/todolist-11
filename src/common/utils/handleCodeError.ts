import { Dispatch } from "@reduxjs/toolkit"
import { changeStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { BaseResponse } from "@/common/components/types"

export const handleCodeError = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  dispatch(changeStatusAC({ status: "failed" }))
  const errorMessage = data.messages.length ? data.messages[0] : "Something went wrong"
  dispatch(setErrorAC({ error: errorMessage }))
}
