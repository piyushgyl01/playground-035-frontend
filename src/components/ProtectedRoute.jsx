import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../features/auth/authSlice";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading && isCheckingAuth) {
      dispatch(getCurrentUser())
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setIsCheckingAuth(false);
        });
    } else if (isAuthenticated) {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, loading, dispatch, isCheckingAuth]);

  if (loading || isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> :<Navigate to="/login" replace/>
}
