import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
 
  const {user, loading} = useSelector((state)=>state.auth)

  if (loading) return <Loading fullScreen message="Authenticating..." />;

  if (!user) return <Navigate to="/login" />

  return children;
};

export default ProtectedRoute;
