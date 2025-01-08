"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { authOnChange, getCurrentUser, login, signUp } from "@/services/auth";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/stores/useLoading";
import TabsComponent from "@/components/TabsComponent";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().nonempty("กรุณากรอกชื่อผู้ใช้"),
  password: z
    .string()
    .nonempty("กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

const signUpSchema = z.object({
  username: z.string().nonempty("กรุณากรอกชื่อผู้ใช้"),
  password: z
    .string()
    .nonempty("กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  repeatedPassword: z.string().nonempty("กรุณากรอกรหัสผ่านอีกครั้ง"),
});

export default function LoginPage() {
  const router = useRouter();
  const tabOptions = [
    {
      label: "Login",
      value: "login",
      content: <LoginForm />,
      default: true,
    },
    {
      label: "Signup",
      value: "signup",
      content: <SignupForm />,
    },
  ];

  useEffect(() => {
    authOnChange((event: any, session: any) => {
      if (session) {
        router.push("/");
      }
    });
  }, []);

  return (
    <div>
      <div className="text-4xl text-center w-full mb-8">
        <h1>
          Welcome to <span className="font-bold">SowCycle</span>
        </h1>
      </div>
      <TabsComponent tabOptions={tabOptions} />
    </div>
  );
}

const LoginForm = () => {
  const { setIsLoading } = useLoading();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="eg. yourname@mail.com"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
};

const SignupForm = () => {
  const { setIsLoading } = useLoading();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      repeatedPassword: "",
    },
  });

  const disabled = useMemo(() => {
    return form.getValues("repeatedPassword") !== form.getValues("password");
  }, [form.watch("repeatedPassword"), form.watch("password")]);

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="eg. yourname@mail.com"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
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
              <FormLabel>Repeated Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="repeated password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={disabled} type="submit">
          Signup
        </Button>
      </form>
    </Form>
  );
};
