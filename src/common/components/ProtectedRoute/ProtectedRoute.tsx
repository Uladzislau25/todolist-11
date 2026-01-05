import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"
import { Navigate } from "react-router"
import { Path } from "@/common/routing"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }
  return children
}
