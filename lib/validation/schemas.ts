import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid account email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
  auth_trap: z.string().max(0, "Invalid submission").optional(),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["brand", "talent", "founder", "admin"], {
    errorMap: () => ({ message: "Please select an account type" }),
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms and Privacy Policy" }),
  }),
  signup_trap: z.string().max(0, "Invalid submission").optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter the email associated with your account"),
  recovery_trap: z.string().max(0, "Invalid submission").optional(),
});

export const inquirySchema = z.object({
  brandName: z.string().min(2, "Brand or company name must be at least 2 characters").max(100),
  contactName: z.string().min(2, "Contact name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid business email address").max(150),
  phone: z.string().max(30).optional().or(z.literal("")),
  budget: z.string().min(1, "Please select an estimated budget range"),
  timeline: z.string().min(1, "Please specify your target launch timeframe"),
  services: z.array(z.string()).min(1, "Please select at least one service of interest"),
  talentSlug: z.string().optional(),
  message: z.string().min(15, "Please share a brief description of campaign goals (at least 15 characters)").max(2000),
  website_trap: z.string().max(0, "Invalid form submission").optional(),
});

export const creatorApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address").max(150),
  phone: z.string().min(6, "Please provide a valid contact number").max(30),
  location: z.string().min(2, "Please state your current city and country").max(100),
  primaryPlatform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn", "Podcast", "Other"], {
    errorMap: () => ({ message: "Please select your primary platform" }),
  }),
  handle: z.string().min(2, "Please provide your primary handle (e.g. @yourname)").max(60),
  audienceSize: z.string().min(1, "Please select your audience size"),
  niche: z.array(z.string()).min(1, "Please select at least one vertical"),
  bio: z.string().min(25, "Please describe your content style and audience (at least 25 characters)").max(1500),
  portfolioUrl: z.string().url("Please enter a valid URL (e.g. https://...)").optional().or(z.literal("")),
  agency_reference_trap: z.string().max(0, "Invalid form submission").optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type CreatorApplicationInput = z.infer<typeof creatorApplicationSchema>;
