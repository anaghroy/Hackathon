import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense } from "react";
import Loading from "../components/Loading";
import Loader from "../components/ui/Loader";

const ProtectedRoute = ({ children }) => {
 
  const {user, loading} = useSelector((state)=>state.auth)

  if (loading) return <Loading fullScreen message="Authenticating..." />;

  if (!user) return <Navigate to="/login" />

  return (
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  );
};

export default ProtectedRoute;
