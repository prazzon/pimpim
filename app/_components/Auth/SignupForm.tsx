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
   onSubmitAction: (data: SignupFormValues) => void;
   pending: boolean;
}

export default function SignupForm({
   onSubmitAction,
   pending,
}: SignupFormProps) {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
      },
   });

   const onFormSubmit = handleSubmit((data) => {
      onSubmitAction(data);
   });

   return (
      <form onSubmit={onFormSubmit}>
         <Input
            label="Username"
            type="text"
            placeholder="Olayinka"
            icon={<FaUser />}
            error={errors.username?.message}
            {...register("username")}
         />
         <Input
            label="Email"
            type="email"
            placeholder="olayinka@gmail.com"
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
