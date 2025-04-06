"use client";

import {
   signupSchema,
   type SignupFormValues,
} from "@/app/_lib/zod/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaLock, FaUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Button, Input } from "../UI/Input/Input";
import Loader from "../UI/Loader/Loader";

interface SignupFormProps {
   onSubmit: (data: SignupFormValues) => void;
   pending: boolean;
}

export default function SignupForm({ onSubmit, pending }: SignupFormProps) {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         fullName: "",
         email: "",
         password: "",
         confirmPassword: "",
      },
   });

   const onFormSubmit = handleSubmit((data) => {
      onSubmit(data);
   });

   return (
      <form onSubmit={onFormSubmit}>
         <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={<FaUser />}
            error={errors.fullName?.message}
            {...register("fullName")}
         />
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
            placeholder="Create a password"
            icon={<FaLock />}
            error={errors.password?.message}
            {...register("password")}
         />
         <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            icon={<FaLock />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
         />
         <Button style={{ marginTop: "20px" }} type="submit" disabled={pending}>
            {pending && <Loader />}
            {pending ? "Creating account" : "Create account"}
         </Button>
      </form>
   );
}
