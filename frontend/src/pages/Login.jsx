import React, { useState } from "react";
import api from "@/api/api";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    padding: "16px",
  };

  const cardWrapperStyle = {
    width: "100%",
    maxWidth: "448px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const inputWrapperStyle = {
    position: "relative",
  };

  const iconStyle = {
    position: "absolute",
    left: "12px",
    top: "12px",
    width: "16px",
    height: "16px",
    color: "#94a3b8",
  };

  const inputStyle = {
    paddingLeft: "40px",
  };

  return (
    <div style={containerStyle}>
      <div style={cardWrapperStyle}>
        <Card>
          <CardHeader style={{ textAlign: "center" }}>
            <CardTitle style={{ fontSize: "24px", fontWeight: "bold" }}>
              Welcome back
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={login} style={formStyle}>
              <div style={fieldStyle}>
                <Label htmlFor="email">Email</Label>
                <div style={inputWrapperStyle}>
                  <Mail style={iconStyle} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={fieldStyle}>
                <Label htmlFor="password">Password</Label>
                <div style={inputWrapperStyle}>
                  <Lock style={iconStyle} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <Link to="/signup">
                <Button
                  type="button"
                  variant="outline"
                  style={{ width: "100%" }}
                >
                  Create New Account
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
