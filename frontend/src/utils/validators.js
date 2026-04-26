export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Invalid email format";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return "Password must contain uppercase, lowercase, number and special character";
  }
  
  return "";
};

export const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers and underscores";
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName || "This field"} is required`;
  }
  return "";
};

export const authValidator = (name, value, formData) => {
  switch (name) {
    case "email":
      return validateEmail(value);
    case "username":
      return validateUsername(value);
    case "password":
      return validatePassword(value);
    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
      return "";
    case "identifier":
      return validateRequired(value, "Email or Username");
    case "currentPassword":
      return validateRequired(value, "Current Password");
    case "newPassword":
      return validatePassword(value);
    default:
      return "";
  }
};
