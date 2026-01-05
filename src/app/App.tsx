import "./App.css"
import { selectThemeMode } from "@/app/app-slice"
import { ErrorSnackbar, Header } from "@/common/components"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { Routing } from "@/common/routing"
import { useEffect, useState } from "react"
import { initializeAppTC } from "@/features/auth/model/auth-slice.ts"
import { CircularProgress } from "@mui/material"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const theme = getTheme(themeMode)

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  if (!isInitialized) {
    return (
      <div>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
