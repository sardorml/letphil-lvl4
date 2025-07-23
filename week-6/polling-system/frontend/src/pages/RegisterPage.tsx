import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth"; // Import AuthError for better typing
import { auth } from "../firebase"; // Your initialized Firebase auth instance
import { useNavigate } from "react-router";
import { toast } from "sonner";
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission to handle it with React

    const form = event.target as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmPassword = form.elements.namedItem(
      "confirmPassword"
    ) as HTMLInputElement;

    if (password.value !== confirmPassword.value) {
      toast.error("Passwords do not math");
      return;
    }

    try {
      // The core function for email/password sign-in
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      console.log("User Created successfully!", userCredential.user.uid);
      localStorage.setItem("userId", userCredential.user.uid); // Store user ID in localStorage
      navigate("/"); // Redirect to the dashboard or another page after successful login
      // You can now redirect the user, update your UI, or navigate to a protected route
      // The `userCredential.user` object contains the authenticated user's details.
    } catch (err) {
      // Type assertion for Firebase AuthError
      const firebaseError = err as AuthError;
      console.error(
        "Error signing in:",
        firebaseError.code,
        firebaseError.message
      );

      // Provide user-friendly error messages based on Firebase error codes
      switch (firebaseError.code) {
        case "auth/user-not-found":
          toast.error(
            "No user found with this email. Please check your email or sign up."
          );
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          toast.error("The email address is not valid.");
          break;
        case "auth/too-many-requests":
          toast.error(
            "Too many failed login attempts. Please try again later."
          );
          break;
        default:
          toast.error("Failed to sign in. Please try again.");
          break;
      }
    }
  };
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <form onSubmit={handleSignIn} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Acme Inc.</span>
                </a>
                <h1 className="text-xl font-bold">Create your account</h1>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign in
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    required
                    aria-label="Email address"
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    required
                    aria-label="Password"
                    autoComplete="current-password"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="align-items-center flex justify-center">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full align-items-center flex justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
