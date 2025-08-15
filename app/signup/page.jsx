"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { Alert, AlertDescription } from "@/components/alert";
import { supabase } from "@/lib/supabase";

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo:
                        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
                },
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Check your email for the confirmation link!");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-screen flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto glass-effect shadow-2xl border-0 animate-pulse-glow">
                <CardHeader className="space-y-3 text-center pb-8">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-sans">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base font-medium">
                        Join us today and start your journey
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-slate-700 font-semibold text-sm tracking-wide"
                            >
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 px-4 text-base bg-white/50 border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-slate-700 font-semibold text-sm tracking-wide"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a secure password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                                className="h-12 px-4 text-base bg-white/50 border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-slate-700 font-semibold text-sm tracking-wide"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 px-4 text-base bg-white/50 border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 placeholder:text-slate-400"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        )}

                        {message && (
                            <Alert className="bg-emerald-50/80 border-emerald-200 backdrop-blur-sm">
                                <AlertDescription className="text-emerald-700 font-medium">
                                    {message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold bg-primary hover:bg-accent text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="pt-4 text-center border-t border-slate-200/50">
                        <p className="text-slate-600 text-sm">
                            Already have an account?{" "}
                            <button
                                type="button"

                                onClick={() => (window.location.href = "/signin")}
                                className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition-colors duration-200"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignupForm;
