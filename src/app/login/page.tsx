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
import { authOnChange, login, signUp } from "@/services/auth";
import { useEffect, useMemo, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useLoading } from "@/stores/useLoading";
import TabsComponent from "@/components/TabsComponent";

const formSchema = z.object({
  username: z.string().nonempty("กรุณากรอกชื่อผู้ใช้"),
  password: z.string().nonempty("กรุณากรอกรหัสผ่าน"),
});

export default function LoginPage() {
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
        redirect("/");
      }
    });
  }, []);

  return (
    <div>
      <div className="text-4xl text-center w-full bg-gray-300 rounded-lg p-8 mb-8">
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await login(values.username, values.password);
    } catch (err) {
      form.setError("password", {
        type: "manual",
        message: "อีเมลล์ หรือ รหัสผ่าน ไม่ถูกต้อง",
      });
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
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const { setIsLoading } = useLoading();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const disabled = useMemo(() => {
    return repeatedPassword !== form.getValues("password");
  }, [repeatedPassword, form.getValues("password")]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signUp(values.username, values.password);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
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

        <FormItem>
          <FormLabel>Repeat password</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="repeat password again"
              value={repeatedPassword}
              onChange={(e) => setRepeatedPassword(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button disabled={disabled} type="submit">
          Signup
        </Button>
      </form>
    </Form>
  );
};
