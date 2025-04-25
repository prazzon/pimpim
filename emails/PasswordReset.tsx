import {
   Body,
   Button,
   Container,
   Head,
   Heading,
   Html,
   Img,
   Preview,
   Section,
   Tailwind,
   Text,
} from "@react-email/components";
import * as React from "react";

type Props = {
   resetLink: string;
};

const PasswordReset = ({ resetLink }: Props) => {
   return (
      <Html>
         <Tailwind>
            <Head />
            <Preview>Reset your password</Preview>
            <Body className="font-sans py-[40px]">
               <Container className="bg-[#f6f8fa] rounded-[16px] mx-auto p-[32px] max-w-[600px]">
                  <Section className="text-center mb-[24px]">
                     <Img
                        src="https://www.pimpim.ng/logo.png"
                        width="40"
                        height="40"
                        alt="PimPim Logo"
                        className="w-[40px] h-auto object-cover mx-auto"
                     />
                  </Section>

                  <Section className="mb-[20px]">
                     <Heading className="text-[22px] font-medium text-[#0a0c1b] text-center m-0 mb-[16px]">
                        Reset Your Password
                     </Heading>

                     <Text className="text-[15px] text-center leading-[26px] text-[#4c4c4c]">
                        You requested to reset your password. Click the button
                        below to create a new password. If you didn&apos;t
                        request this, you can safely ignore this email.
                     </Text>
                  </Section>

                  <Section className="text-center mt-[20px] mb-[20px]">
                     <Button
                        className="bg-black text-white font-bold py-[14px] px-[28px] rounded-[12px] no-underline text-center box-border hover:bg-[#333]"
                        href={resetLink}
                     >
                        Reset Password
                     </Button>
                  </Section>

                  <Section className="mb-[24px] border-t border-[#dde5f0] pt-[24px]">
                     <Text className="text-[14px] text-center leading-[22px] text-[#666] m-0">
                        This link will expire in 15 minutes. If you did not
                        request a password reset, you can safely ignore this
                        email.
                     </Text>
                  </Section>

                  <Section className="border-t border-solid border-[#dde5f0] mt-[24px] pt-[24px] text-[12px] text-center text-[#8898aa]">
                     <Text className="m-0">
                        © {new Date().getFullYear()} PimPim. All rights
                        reserved.
                     </Text>
                  </Section>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
};

export default PasswordReset;
