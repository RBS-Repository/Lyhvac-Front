"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import Swal from 'sweetalert2';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Anti-spam honeypot field
  const [signupAttempts, setSignupAttempts] = useState<number>(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12 && !/[0-9]/.test(password)) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleBlur = (field: 'name' | 'email' | 'password' | 'confirm') => {
    setTouched({ ...touched, [field]: true });
  };

  // Check if user is blocked (rate limiting)
  useEffect(() => {
    const storedAttempts = localStorage.getItem('signupAttempts');
    const lastAttempt = localStorage.getItem('lastSignupAttempt');
    const now = Date.now();
    
    if (storedAttempts) {
      setSignupAttempts(parseInt(storedAttempts));
    }
    
    // Block for 15 minutes if 5+ attempts
    if (storedAttempts && parseInt(storedAttempts) >= 5) {
      if (lastAttempt) {
        const timeSinceLastAttempt = now - parseInt(lastAttempt);
        const blockDuration = 15 * 60 * 1000; // 15 minutes
        
        if (timeSinceLastAttempt < blockDuration) {
          setIsBlocked(true);
          const remainingTime = Math.ceil((blockDuration - timeSinceLastAttempt) / 1000 / 60);
          setError(`Too many signup attempts. Please try again in ${remainingTime} minutes.`);
        } else {
          // Block expired, reset
          localStorage.removeItem('signupAttempts');
          localStorage.removeItem('lastSignupAttempt');
          setSignupAttempts(0);
          setIsBlocked(false);
        }
      }
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Anti-spam: Check honeypot field
    if (honeypot !== "") {
      console.error("Bot detected");
      setError("Invalid request detected");
      return;
    }

    // Check if blocked
    if (isBlocked) {
      return;
    }

    // Validation
    if (!name || name.trim().length === 0) {
      setError("Name is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Block disposable email domains
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
      'trashmail.com', 'mailinator.com', 'getnada.com', 'yopmail.com', 'sharklasers.com',
      'maildrop.cc', 'mohmal.com', 'tempmailo.com', 'temp-mail.org'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      setError("Please use a real email address. Disposable email addresses are not allowed.");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
    if (weakPasswords.includes(password.toLowerCase())) {
      setError("This password is too common. Please choose a stronger password.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    // Increment signup attempts
    const newAttempts = signupAttempts + 1;
    setSignupAttempts(newAttempts);
    localStorage.setItem('signupAttempts', newAttempts.toString());
    localStorage.setItem('lastSignupAttempt', Date.now().toString());

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      // Create user record in MongoDB
      try {
        await fetch('http://localhost:5001/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseUID: userCredential.user.uid,
            email: email,
            displayName: name.trim(),
          }),
        });
      } catch (dbError) {
        console.error('Failed to create user record in database:', dbError);
        // Continue with login even if DB creation fails
      }
      
      // Reset signup attempts on success
      localStorage.removeItem('signupAttempts');
      localStorage.removeItem('lastSignupAttempt');
      setSignupAttempts(0);
      
      // Show success message with admin approval notice
      await Swal.fire({
        icon: 'success',
        title: 'Account Created Successfully!',
        html: `
          <p style="margin: 20px 0;">Your account has been created and is pending admin approval.</p>
          <p style="margin: 20px 0; color: #666;">An administrator will review and approve your account shortly. You will be notified once your account is active.</p>
          <p style="margin: 20px 0; color: #999; font-size: 14px;">Please note: You cannot log in until your account is approved.</p>
        `,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      
      // Sign out the user since account is disabled
      await signOut(firebaseAuth);
      
      // Redirect to login page
      router.push("/login");
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email address is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('The password is too weak. Please choose a stronger password.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
          break;
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-gray-900">
              LY <span className="text-blue-600">HVAC</span>
            </span>
            <span className="text-xs text-gray-600 uppercase tracking-wider">Systems & Parts</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Korean-inspired accent line */}
          <div className="mb-8">
            <div className="w-12 h-1 bg-blue-600 mb-6"></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join LY HVAC and access premium HVAC solutions</p>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative">
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              {/* Name Field */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                    touched.name && !name.trim()
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="John Doe"
                  aria-invalid={touched.name && !name.trim() ? "true" : "false"}
                  aria-describedby={touched.name && !name.trim() ? "name-error" : undefined}
                  required
                />
                {touched.name && !name.trim() && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                    Name is required
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                    touched.email && !validateEmail(email) && email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={touched.email && !validateEmail(email) && email ? "true" : "false"}
                  aria-describedby={touched.email && !validateEmail(email) && email ? "email-error" : undefined}
                  required
                />
                {touched.email && !validateEmail(email) && email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                      touched.password && password.length < 6 && password
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Create a strong password"
                    aria-invalid={touched.password && password.length < 6 && password ? "true" : "false"}
                    aria-describedby={password ? "password-strength" : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div id="password-strength" className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength === 1 ? 'text-red-600' :
                        passwordStrength.strength === 2 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Use at least 8 characters with numbers for best security</p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label 
                  htmlFor="confirm" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                      touched.confirm && password !== confirm && confirm
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Re-enter your password"
                    aria-invalid={touched.confirm && password !== confirm && confirm ? "true" : "false"}
                    aria-describedby={touched.confirm && password !== confirm && confirm ? "confirm-error" : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {touched.confirm && password !== confirm && confirm && (
                  <p id="confirm-error" className="mt-1 text-sm text-red-600" role="alert">
                    Passwords do not match
                  </p>
                )}
                {password && confirm && password === confirm && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Passwords match
                  </p>
                )}
              </div>

              {/* Honeypot field - Hidden from humans, bots will fill it */}
              <input
                type="text"
                id="website"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                style={{ position: 'absolute', left: '-9999px' }}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                  aria-describedby="terms-description"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  <span id="terms-description">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                      Terms & Conditions
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                    role="alert"
                  >
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              href="/login"
              className="block w-full text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sign In Instead
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} LY HVAC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
