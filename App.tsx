import { useState } from "react";
import "./App.css";
import * as api from "./api";

interface Professional {
  id: number;
  name: string;
  profession: string;
  location: string;
  rating: number;
}

interface Service {
  id: number;
  name: string;
  professionId: number;
  description: string;
  icon: string;
}

const professionals: Professional[] = [
  { id: 1, name: "Rajesh Kumar", profession: "Plumber", location: "Mumbai", rating: 4.9 },
  { id: 2, name: "Priya Sharma", profession: "Tutor (Math & Science)", location: "Bangalore", rating: 5.0 },
  { id: 3, name: "Amit Patel", profession: "Web Designer", location: "Hyderabad", rating: 4.8 },
  { id: 4, name: "Kavita Singh", profession: "Electrician", location: "Delhi", rating: 4.9 },
];

const services: Service[] = [
  { id: 1, name: "Plumbing Repair", professionId: 1, description: "Fix leaks and pipes", icon: "🔧" },
  { id: 2, name: "Plumbing Installation", professionId: 1, description: "Install new fixtures", icon: "🚰" },
  { id: 3, name: "Math Tutoring", professionId: 2, description: "1-on-1 Math sessions", icon: "📐" },
  { id: 4, name: "Science Tutoring", professionId: 2, description: "Science concepts explained", icon: "🧪" },
  { id: 5, name: "Web Design", professionId: 3, description: "Professional web designs", icon: "🎨" },
  { id: 6, name: "Responsive Layout", professionId: 3, description: "Mobile-friendly designs", icon: "📱" },
  { id: 7, name: "Electrical Repair", professionId: 4, description: "Fix electrical issues", icon: "⚡" },
  { id: 8, name: "Electrical Installation", professionId: 4, description: "Install new circuits", icon: "💡" },
];

interface CaptchaState {
  num1: number;
  num2: number;
  answer: string;
}

const generateCaptcha = (): CaptchaState => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  return { num1, num2, answer: "" };
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaState>(generateCaptcha());
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [serviceType, setServiceType] = useState("standard");
  const [notes, setNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [currentView, setCurrentView] = useState<"home" | "services" | "booking">("home");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setLoginError("");
    
    if (!email.trim()) {
      setLoginError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setLoginError("Please enter your password");
      return;
    }
    if (captcha.answer === "") {
      setLoginError("Please answer the CAPTCHA");
      return;
    }

    const correctAnswer = captcha.num1 + captcha.num2;
    if (parseInt(captcha.answer) !== correctAnswer) {
      setLoginError("Incorrect CAPTCHA answer. Try again.");
      setCaptcha(generateCaptcha());
      return;
    }

    setIsSubmitting(true);
    const result = await api.login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsLoggedIn(true);
      setUserId(result.data.user.id);
      setEmail("");
      setPassword("");
      setCaptcha(generateCaptcha());
      console.log("✓ User logged in successfully");
    } else {
      setLoginError(result.error || "Login failed");
    }
  };

  const handleSignup = async () => {
    setLoginError("");

    if (!email.trim()) {
      setLoginError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setLoginError("Please enter your password");
      return;
    }
    if (password.length < 6) {
      setLoginError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLoginError("Passwords do not match");
      return;
    }
    if (captcha.answer === "") {
      setLoginError("Please answer the CAPTCHA");
      return;
    }

    const correctAnswer = captcha.num1 + captcha.num2;
    if (parseInt(captcha.answer) !== correctAnswer) {
      setLoginError("Incorrect CAPTCHA answer. Try again.");
      setCaptcha(generateCaptcha());
      return;
    }

    setIsSubmitting(true);
    const result = await api.signup(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsLoggedIn(true);
      setUserId(result.data.user.id);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCaptcha(generateCaptcha());
      setIsSigningUp(false);
      console.log("✓ User signed up successfully");
    } else {
      setLoginError(result.error || "Signup failed");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCaptcha(generateCaptcha());
    setCurrentView("home");
    setSelectedProfessional(null);
    setIsSigningUp(false);
  };

  const handleBooking = async () => {
    if (!selectedProfessional || !customerName || !date || !time || !userId) {
      alert("Please fill all fields before booking.");
      return;
    }

    setIsLoading(true);

    const result = await api.createBooking(
      userId,
      customerName,
      selectedProfessional.id,
      selectedProfessional.name,
      date,
      time,
      duration,
      serviceType,
      notes
    );

    setIsLoading(false);

    if (result.success) {
      const booking = result.data.booking;
      setBookingId(booking._id);
      setBookingSuccess(true);
      console.log("✓ Booking confirmed with ID:", booking._id);
    } else {
      alert(result.error || "Booking failed");
    }
  };

  const submitFeedbackHandler = async () => {
    if (feedback.trim() === "") {
      alert("Please write your suggestion.");
      return;
    }

    if (!bookingId || !userId) {
      alert("Booking or user information missing.");
      return;
    }

    setIsLoading(true);

    const result = await api.submitFeedback(bookingId, userId, feedback);

    setIsLoading(false);

    if (result.success) {
      setFeedbackMessage("Thank you for your valuable feedback!");
      setFeedback("");
      console.log("✓ Feedback saved for booking:", bookingId);

      // Auto-redirect to services after 2 seconds
      setTimeout(() => {
        setCurrentView("services");
        setSelectedProfessional(null);
        setCustomerName("");
        setDate("");
        setTime("");
        setDuration("1");
        setServiceType("standard");
        setNotes("");
        setBookingSuccess(false);
        setFeedback("");
        setFeedbackMessage("");
      }, 2000);
    } else {
      alert(result.error || "Feedback submission failed");
    }
  };

  const handleServiceClick = (service: Service) => {
    const professional = professionals.find(p => p.id === service.professionId);
    if (professional) {
      setSelectedProfessional(professional);
      setCurrentView("booking");
      setBookingSuccess(false);
      setFeedbackMessage("");
    }
  };

  const handleNameChange = (value: string) => {
    // Only allow letters and spaces (remove numbers/symbols)
    const validName = value.replace(/[^a-zA-Z\s]/g, "");
    setCustomerName(validName);
  };

  return (
    <>
      {!isLoggedIn ? (
        // Login Page
        <div className="login-page">
          <div className="login-container">
            <h1>ProBooking</h1>
            <p className="login-subtitle">Professional Services Booking Platform</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                isSigningUp ? handleSignup() : handleLogin();
              }}
              className="login-form"
            >
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
              </div>

              {isSigningUp && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="login-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label>CAPTCHA: What is {captcha.num1} + {captcha.num2}?</label>
                <input
                  type="number"
                  placeholder="Enter the answer"
                  value={captcha.answer}
                  onChange={(e) => setCaptcha({ ...captcha, answer: e.target.value })}
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setCaptcha(generateCaptcha())}
                  className="refresh-captcha-btn"
                >
                  🔄 Refresh
                </button>
              </div>

              {loginError && <p className="error-message">{loginError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="login-btn"
              >
                {isSubmitting ? (isSigningUp ? "Signing up..." : "Logging in...") : (isSigningUp ? "Sign Up" : "Login")}
              </button>
            </form>

            <div className="auth-toggle">
              <p>
                {isSigningUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSigningUp(!isSigningUp);
                    setLoginError("");
                    setCaptcha(generateCaptcha());
                  }}
                  className="auth-toggle-btn"
                >
                  {isSigningUp ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>

            <p className="login-footer">
              Demo: Use any email and password. Solve the CAPTCHA to {isSigningUp ? "sign up" : "login"}.
            </p>
          </div>
        </div>
      ) : (
        // Main App (shown after login)
        <>
          {/* Navigation Bar */}
          <nav className="navbar">
            <div className="navbar-brand">ProBooking</div>
            <div className="navbar-links">
              <button
                className={`nav-link ${currentView === "home" ? "active" : ""}`}
                onClick={() => {
                  setCurrentView("home");
                  setSelectedProfessional(null);
                }}
              >
                Home
              </button>
              <button
                className={`nav-link ${currentView === "services" ? "active" : ""}`}
                onClick={() => setCurrentView("services")}
              >
                Services
              </button>
              <button
                className={`nav-link ${currentView === "booking" && selectedProfessional ? "active" : ""}`}
                onClick={() => currentView !== "booking" && selectedProfessional && setCurrentView("booking")}
                disabled={!selectedProfessional}
              >
                Booking
              </button>
              <button
                className="nav-link logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </nav>

          {/* Home Section */}
          {currentView === "home" && (
            <div className="section-content">
              <h1>Find & Hire the Right Professional</h1>

              {/* Professionals */}
              <h2>Available Professionals</h2>

              {professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="professional-card"
                >
                  <h3>{pro.name}</h3>
                  <p>
                    <strong>Profession:</strong> {pro.profession}
                  </p>
                  <p>
                    <strong>Location:</strong> {pro.location}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐ {pro.rating}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedProfessional(pro);
                      setCurrentView("booking");
                      setBookingSuccess(false);
                      setFeedbackMessage("");
                    }}
                    className="book-now-btn"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Services Section */}
          {currentView === "services" && (
            <div className="section-content">
              <h1>Our Services</h1>
              <div className="services-grid">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="service-card"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="service-icon">{service.icon}</div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-professional">
                      by {professionals.find(p => p.id === service.professionId)?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Section - Full Screen */}
          {currentView === "booking" && selectedProfessional && (
            <div className="booking-fullscreen">
              <div className="booking-form-fullscreen">
                <button
                  className="close-booking-btn"
                  onClick={() => {
                    setCurrentView("home");
                    setSelectedProfessional(null);
                    setCustomerName("");
                    setDate("");
                    setTime("");
                    setDuration("1");
                    setServiceType("standard");
                    setNotes("");
                    setBookingSuccess(false);
                  }}
                >
                  ✕
                </button>

                <h2>Book Appointment with {selectedProfessional.name}</h2>

                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="form-input"
                  title="Enter your full name (letters and spaces only)"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  title="Select a booking date"
                />

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="form-input"
                  title="Select a booking time"
                />

                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                  title="Select duration"
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="halfday">Half Day (4 Hours)</option>
                  <option value="fullday">Full Day (8 Hours)</option>
                </select>

                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="form-input"
                  title="Select service type"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="express">Express</option>
                </select>

                <textarea
                  placeholder="Additional Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="form-input"
                  title="Enter any additional notes"
                />

                <button
                  onClick={handleBooking}
                  className="confirm-booking-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Confirming..." : "Confirm Booking"}
                </button>

                {/* Success Message */}
                {bookingSuccess && (
                  <div className="success-message">
                    🎉 Booking confirmed with {selectedProfessional.name} on {date} at {time} ({duration} {typeof duration === 'number' ? 'hour' : duration})!
                    <p className="success-details">Service Type: {serviceType}</p>
                    {notes && <p className="success-details">Notes: {notes}</p>}
                  </div>
                )}

                {/* Feedback Section */}
                {bookingSuccess && (
                  <div className="feedback-section">
                    <h3>Give Your Suggestions</h3>
                    <textarea
                      placeholder="Write your feedback..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      className="feedback-textarea"
                      title="Enter your feedback"
                    />
                    <button
                      onClick={submitFeedbackHandler}
                      className="submit-feedback-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit Feedback"}
                    </button>

                    {feedbackMessage && (
                      <div>
                        <p className="feedback-message">{feedbackMessage}</p>
                        <p className="feedback-redirect-message">
                          Redirecting to services in 2 seconds...
                        </p>
                        <button
                          onClick={() => {
                            setCurrentView("services");
                            setSelectedProfessional(null);
                            setCustomerName("");
                            setDate("");
                            setTime("");
                            setDuration("1");
                            setServiceType("standard");
                            setNotes("");
                            setBookingSuccess(false);
                            setFeedback("");
                            setFeedbackMessage("");
                          }}
                          className="return-services-btn"
                        >
                          Return to Services
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default App;
