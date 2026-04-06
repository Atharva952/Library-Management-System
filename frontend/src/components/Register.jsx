import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, verifyOTP } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await register(formData);
      setStep(2);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      await verifyOTP(formData.email, otp);
      navigate("/login");
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <section className="auth-page">
        <div className="auth-card surface-noise">
          <span className="pill">One last step</span>
          <h1 className="mt-4 page-title">Verify Your Email</h1>
          <p className="page-subtitle">
            We sent a 6-digit OTP to <span className="font-semibold">{formData.email}</span>
          </p>

          {errors.submit && <div className="status-error mt-5">{errors.submit}</div>}

          <div className="mt-6">
            <label className="field-label">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="field-input text-center tracking-[0.5em]"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="btn-primary mt-5 w-full"
          >
            {isLoading ? "Verifying..." : "Verify and Continue"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            OTP not received? Check spam or use resend from backend API.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card surface-noise">
        <span className="pill">Get Started</span>
        <h1 className="mt-4 page-title">Create Account</h1>
        <p className="page-subtitle">Join the library and start exploring titles instantly.</p>

        {errors.submit && <div className="status-error mt-5">{errors.submit}</div>}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="field-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="field-input"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="field-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="field-input"
              placeholder="At least 8 characters"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
