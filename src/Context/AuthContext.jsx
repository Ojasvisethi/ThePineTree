import { createContext, useContext, useReducer } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const initialState = {
  user: {},
  isAuthenticated: false,
  isAdmin: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payLoad.User,
        isAuthenticated: true,
        isAdmin: action.payLoad.isAdmin,
      };
    case "getCurrentUser":
      return {
        ...state,
        user: action.payLoad,
      };
    case "logout":
      return {
        ...initialState,
      };
    default:
      return new Error("Error logging in");
  }
}

export default function AuthProvider({ children }) {
  const [{ user, isAuthenticated, isAdmin }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function handleSubmit(email, password) {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // User login successful
        const { token, isAdmin, User } = await response.json();
        localStorage.setItem("sessionToken", token); // Store the session token in localStorage
        // console.log("Logged in successfully!");
        dispatch({ type: "login", payLoad: { token, isAdmin, User } });
      } else {
        // User login failed
        const errorData = await response.json();
        console.log(errorData);
        toast.error(errorData.message);
        // Handle the error and display an appropriate message to the user
      }
    } catch (error) {
      toast.error(error.message);
      // Handle any other errors that may occur during the login process
    }
  }

  async function getCurrentUser(sessionToken) {
    if (!sessionToken) {
      return null;
    }

    try {
      const decodedToken = await fetch(
        `http://localhost:3000/user/getUser?token=${sessionToken}`
      );
      const response = await decodedToken.json();
      console.log(response); // This will give you the decoded token object
      return response; // Assuming the user data is stored under 'user' field in the token
    } catch (error) {
      // Handle the error if needed
      toast.error(error.message);
      return null;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        handleSubmit,
        user,
        isAuthenticated,
        dispatch,
        isAdmin,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Context used outside context Provider");

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth };
