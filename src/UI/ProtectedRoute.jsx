import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SpinnerFullPage from "./SpinnerFullPage";
import { useAuth } from "../Context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, getCurrentUser, dispatch } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(
    async (sessionToken) => {
      const user = await getCurrentUser(sessionToken);
      console.log(user);
      if (user) {
        dispatch({ type: "getCurrentUser", payLoad: user?.user });
      }
      setLoading(false);
    },
    [getCurrentUser, dispatch]
  );
  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");

    // If the user data is already available in the AuthContext, no need to fetch it again
    if (isAuthenticated) {
      setLoading(false);
    } else if (sessionToken) {
      // If there's a session token but no user data, fetch the user data using the getCurrentUser function
      fetchCurrentUser(sessionToken);
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, [navigate, isAuthenticated, getCurrentUser, dispatch, fetchCurrentUser]);

  if (loading) {
    return <SpinnerFullPage />;
  }

  return children;
}

export default ProtectedRoute;
