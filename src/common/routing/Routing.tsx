import { Main } from "@/app/Main"
import { Route, Routes } from "react-router"
import { Login } from "@/features/auth/ui/Login/Login.tsx"

export const Path = {
  Main: "/",
  Login: "/login",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Login} element={<Login />} />
  </Routes>
)
