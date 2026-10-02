import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

//this component expects children
//we will do something like:-
// <ProtectRoute> <Dashboard/> </ProtectedRoute> thats why
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
    //find from store is user authenticated
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  //if not then show him/her login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;