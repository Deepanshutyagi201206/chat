import { Navigate, Outlet } from "react-router-dom"

const Authenticate = () => {

    const token = localStorage.getItem("token")

    return token ? <Outlet /> : <Navigate to={"/"} />
}

export default Authenticate