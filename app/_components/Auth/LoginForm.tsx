"use client";

import {
   loginSchema,
   type LoginFormValues,
} from "@/app/_lib/zod/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Button, Checkbox, ForgotPassword, Input } from "../UI/Input/Input";
import Loader from "../UI/Loader/Loader";

interface LoginFormProps {
   onSubmitAction: (data: LoginFormValues) => void;
   pending?: boolean;
}

export default function LoginForm({ onSubmitAction, pending }: LoginFormProps) {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
         rememberMe: false,
      },
   });

   const onFormSubmit = handleSubmit((data) => {
      onSubmitAction(data);
   });

   return (
      <form onSubmit={onFormSubmit}>
         <Input
            label="Email"
            type="email"
            placeholder="hi@yourcompany.com"
            icon={<IoMail />}
            error={errors.email?.message}
            {...register("email")}
         />
         <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<FaLock />}
            error={errors.password?.message}
            {...register("password")}
         />
         <div
            style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               marginBottom: "16px",
            }}
         >
            <Checkbox label="Remember me" {...register("rememberMe")} />
            <ForgotPassword />
         </div>
         <Button type="submit" disabled={pending}>
            {pending && <Loader />}
            {pending ? "Signing in" : "Sign in"}
         </Button>
      </form>
   );
}
