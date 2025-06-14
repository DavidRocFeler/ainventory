// src/pages/LoginView.tsx
import { useForm } from "react-hook-form";
import { LoginCredentials } from "../types/auth";
import { useLogin } from "../hooks/auth.hook";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const LoginView = () => {
  const { mutate: login, isPending } = useLogin();
  const form = useForm<LoginCredentials>();

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  //add new deploy
  return (
    <div className="bg-[#E7E1BC] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-[90%] mmd:w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="flex justify-center">
          <img src="/CasaSarda.png" alt="Logo" className="w-[15rem]" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="sarda@gmail.com"
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
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Log in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};