"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { authOnChange, login, signUp } from "@/services/auth";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader, Eye, EyeOff, Sprout, PiggyBank } from "lucide-react";
import Image from "next/image";

const loginSchema = z.object({
  username: z
    .string()
    .email("กรุณากรอกอีเมลที่ถูกต้อง")
    .nonempty("กรุณากรอกอีเมล"),
  password: z
    .string()
    .nonempty("กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

const signUpSchema = z.object({
  username: z
    .string()
    .email("กรุณากรอกอีเมลที่ถูกต้อง")
    .nonempty("กรุณากรอกอีเมล"),
  password: z
    .string()
    .nonempty("กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  repeatedPassword: z.string().nonempty("กรุณากรอกรหัสผ่านอีกครั้ง"),
});

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    authOnChange((event: any, session: any) => {
      if (session) {
        router.push("/");
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Auth Card */}
        <div className="border-0 bg-white rounded-3xl">
          {/* <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-gray-800">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isSignUp
                ? "Join SowCycle and start your sustainable journey"
                : "Sign in to your account to continue"}
            </CardDescription>
          </CardHeader> */}
          <CardContent className="py-8 px-4">
            {/* Logo and Title */}
            <div className="text-center space-y-6 mb-8">
              <div className="flex justify-center">
                <Image
                  src="/logo.svg"
                  alt="SowCycle Logo"
                  width={64}
                  height={64}
                  className="rounded-2xl"
                />
              </div>
              <div>
                {isSignUp ? (
                  <h1 className="text-3xl font-bold">Create Account</h1>
                ) : (
                  <h1 className="text-3xl font-bold">Login to SowCycle</h1>
                )}
                {/*<p className="text-muted-foreground mt-2"an>
                  Note everything about your sows
                </p>*/}
              </div>
            </div>
            {isSignUp ? <SignupForm /> : <LoginForm />}

            {/* Toggle between login and signup */}
            {/*<div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-pink-500 hover:text-pink-600 font-medium underline"
                >
                  {isSignUp ? "Login" : "Create an account"}
                </button>
              </p>
            </div>*/}
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full rounded-full h-11 mt-2 text-pink-500 hover:text-pink-600 font-medium"
            >
              {isSignUp ? "Login" : "Create an account"}
            </Button>
          </CardContent>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values.username, values.password);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        form.setError("password", {
          type: "manual",
          message: "อีเมลล์ หรือ รหัสผ่าน ไม่ถูกต้อง",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground font-medium">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="yourname@example.com"
                  className="h-11 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground font-medium">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-pink-500 hover:text-pink-600 font-medium">
            Forgot password?
          </a>
        </div> */}

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full rounded-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-medium"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Logging in
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
};

const SignupForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      repeatedPassword: "",
    },
  });

  const disabled = useMemo(() => {
    return (
      form.getValues("repeatedPassword") !== form.getValues("password") ||
      form.formState.isSubmitting
    );
  }, [
    form.watch("repeatedPassword"),
    form.watch("password"),
    form.formState.isSubmitting,
  ]);

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      let res = await signUp(values.username, values.password);
      if (res) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (form.getValues("password") === form.getValues("repeatedPassword")) {
      form.clearErrors("repeatedPassword");
    }
    if (form.getValues("repeatedPassword") !== form.getValues("password")) {
      form.setError("repeatedPassword", {
        type: "manual",
        message: "รหัสผ่านไม่ตรงกัน",
      });
    }
  }, [form.watch("repeatedPassword")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground font-medium">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="yourname@example.com"
                  className="h-11 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground font-medium">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="h-11 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatedPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground font-medium">
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    className="h-11 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRepeatPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>At least 6 characters</li>
            <li>Mix of letters and numbers</li>
          </ul>
        </div>

        <Button
          disabled={disabled}
          type="submit"
          className="w-full rounded-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-medium"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Creating account...
            </>
          ) : (
            "Create an account"
          )}
        </Button>
      </form>
    </Form>
  );
};
