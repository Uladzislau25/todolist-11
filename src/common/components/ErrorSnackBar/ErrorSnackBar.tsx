import { SyntheticEvent } from "react"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectError, setErrorAC } from "@/app/app-slice.ts"

export const ErrorSnackbar = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectError)
  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }

    dispatch(setErrorAC({ error: null }))
  }

  return (
    <Snackbar
      open={error !== null}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
