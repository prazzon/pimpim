"use client";

import { initiatePasswordReset } from "@/app/_lib/firebase/auth/password-reset-actions";
import {
   ForgotPasswordFormValues,
   forgotPasswordSchema,
} from "@/app/_lib/zod/schema/password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { IoMail } from "react-icons/io5";
import { Button, Input } from "../UI/Input/Input";
import Loader from "../UI/Loader/Loader";

interface ForgotPasswordFormProps {
   onSubmitAction: (
      data: ForgotPasswordFormValues,
      result: { success: boolean; message: string }
   ) => void;
}

export default function ForgotPasswordForm({
   onSubmitAction,
}: ForgotPasswordFormProps) {
   const [pending, startTransition] = useTransition();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ForgotPasswordFormValues>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: {
         email: "",
      },
   });

   const onFormSubmit = handleSubmit(async (data) => {
      startTransition(async () => {
         const result = await initiatePasswordReset(data.email);
         onSubmitAction(data, result);
      });
   });

   return (
      <form onSubmit={onFormSubmit}>
         <Input
            label="Email"
            type="email"
            placeholder="olayinka@gmail.com"
            icon={<IoMail />}
            error={errors.email?.message}
            {...register("email")}
         />
         <Button style={{ marginTop: "20px" }} type="submit" disabled={pending}>
            {pending && <Loader />}
            {pending ? "Sending..." : "Send Reset Link"}
         </Button>
      </form>
   );
}
