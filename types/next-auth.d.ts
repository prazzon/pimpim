import { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
   /**
    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    */
   interface Session {
      user: {
         /** The user's id. */
         id: string;
         /** The user's profile picture URL. */
         image?: string;
         /** The user's phone number. */
         phone?: string;
         /** The user's role. */
         role?: string;
         /** The user's email verification status. */
         emailVerified?: boolean;
      } & DefaultSession["user"];
   }

   /**
    * The shape of the user object returned in the OAuth providers' `profile` callback,
    * or the second parameter of the `session` callback in `NextAuth`.
    */
   interface User {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      phone?: string;
      role?: string;
   }
}

declare module "next-auth/jwt" {
   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
   interface JWT extends NextAuthJWT {
      /** The user's id. */
      id: string;
      /** The user's profile picture URL. */
      image?: string;
      /** The user's phone number. */
      phone?: string;
      /** The user's role. */
      role?: string;
   }
}
