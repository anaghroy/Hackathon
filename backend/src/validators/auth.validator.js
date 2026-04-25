import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  validate,
];

export const loginValidator = [
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Username or email is required")
    .custom((value) => {
      // if it contains @ → validate as email
      if (value.includes("@")) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error("Please provide a valid email");
        }
      }
      return true;
    }),

  body("password").notEmpty().withMessage("Password is required"),

  validate,
];

export const resetPasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validate,
];

export const updateProfileValidator = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3–20 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Only letters, numbers, underscores allowed"),

  body("bio")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Bio cannot exceed 200 characters"),

  body("city")
    .optional()
    .isLength({ max: 50 })
    .withMessage("City too long"),

  validate,
];
