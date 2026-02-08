// Simple in-memory OTP storage (for demo - use Redis in production)
const otpStore = new Map();

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = (email, otp) => {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
};

export const verifyOTP = (email, otp) => {
  const stored = otpStore.get(email);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  if (stored.otp === otp) {
    otpStore.delete(email);
    return true;
  }
  return false;
};
