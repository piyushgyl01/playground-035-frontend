import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, loginUser, registerUser } from "../features/auth/authSlice";
import { getGithubAuthUrl, getGoogleAuthUrl } from "../services/authService";

export default function AuthForm({ isLogin = true }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setFormError("");
  }

  function validateForm() {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setFormError("Please fill in all required fields");
        return false;
      }
    } else {
      if (
        !formData.username ||
        !formData.password ||
        !formData.email ||
        !formData.name ||
        !formData.confirmPassword
      ) {
        setFormError("Please fill in all required fields");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords do not match");
        return false;
      }

      if (formData.password.length < 8) {
        setFormError("Password must be at least 8 characters long");
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await dispatch(
          loginUser({
            username: formData.username,
            password: formData.password,
          })
        ).unwrap();
      } else {
        await dispatch(
          registerUser({
            name: formData.name,
            username: formData.username,
            password: formData.password,
            email: formData.email,
          })
        ).unwrap();

        navigate("/login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }

  function handleOAuthLogin(provider) {
    if (provider === "google") {
      window.location.href = getGoogleAuthUrl();
    } else if (provider === "github") {
      window.location.href = getGithubAuthUrl();
    }
  }

  return (
    <div className="card shadow-sm border-0 p-4">
      <h3 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h3>

      {(formError || error) && (
        <div className="alert alert-danger">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <div className="mb-">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="d-grid gap-2 mb-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {isLogin ? "Logging in..." : "Creating account..."}
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      <div className="text-center mb-3">
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>

      <div className="text-center">
        <p className="text-muted mb-3">OR CONTINUE WITH</p>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-danger"
            onClick={() => handleOAuthLogin("google")}
            disabled={loading}
          >
            Google
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => handleOAuthLogin("github")}
            disabled={loading}
          >
            Github
          </button>
        </div>
      </div>
    </div>
  );
}
