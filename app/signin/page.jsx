"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { Alert, AlertDescription } from "@/components/alert";
import { supabase } from "@/lib/supabase";

const SignInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                window.location.href = "/dashboard";
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first");
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setError("");
                alert("Password reset email sent! Check your inbox.");
            }
        } catch (err) {
            setError("Failed to send reset email");
        }
    };

    return (
        <div className=" relative h-screen w-screen flex items-center justify-center">
            <Card className="w-full  max-w-md mx-auto glass-effect shadow-2xl border-0 animate-pulse-glow">
                <CardHeader className="space-y-3 text-center pb-8">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Welcome Back!
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Let's dive into the job world
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSignin} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                                Email Address
                            </Label>
                            <Input
                                id="signin-email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 px-4 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                                Password
                            </Label>
                            <Input
                                id="signin-password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 px-4 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold bg-primary hover:bg-accent transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 underline block mx-auto font-medium"
                        >
                            Forgot your password?
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => (window.location.href = "/signup")}
                                    className="text-primary hover:text-accent transition-colors duration-200 font-semibold hover:underline"
                                >
                                    Sign up here
                                </button>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInForm;
