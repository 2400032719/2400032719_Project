const API_URL = "http://localhost:3000/api";

// Auth APIs
export const signup = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Booking APIs
export const createBooking = async (
  userId: string,
  customerName: string,
  professionalId: number,
  professionalName: string,
  date: string,
  time: string,
  duration: string,
  serviceType: string,
  notes: string
) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        customerName,
        professionalId,
        professionalName,
        date,
        time,
        duration,
        serviceType,
        notes,
      }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${userId}`);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Feedback APIs
export const submitFeedback = async (bookingId: string, userId: string, message: string) => {
  try {
    const response = await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, userId, message }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getBookingFeedback = async (bookingId: string) => {
  try {
    const response = await fetch(`${API_URL}/feedback/${bookingId}`);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
