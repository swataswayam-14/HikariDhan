import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email format" });


const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/\d/, { message: "Password must contain at least one number" });

const validateEmail = (email) => {
  const result = emailSchema.safeParse(email);
  return result.success ? true : result.error.errors;
};

const validatePassword = (password) => {
  const result = passwordSchema.safeParse(password);
  return result.success ? true : result.error.errors;
};

export { validateEmail, validatePassword };