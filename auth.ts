import { firestore } from "@/app/_lib/firebase/firestore";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { v4 as uuid } from "uuid";
import { getUserFromDb } from "./app/_lib/firebase/auth/service";

const adapter = FirestoreAdapter(firestore);

export const { handlers, auth, signIn, signOut } = NextAuth({
   adapter: adapter,
   providers: [
      Credentials({
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               return null;
            }

            const { email, password } = credentials;

            try {
               const user = await getUserFromDb(
                  email as string,
                  password as string
               );

               if (!user) return null;

               return user;
            } catch (error) {
               console.error("Authentication error:", error);
               return null;
            }
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user, account }) {
         if (account?.provider === "credentials") {
            token.credentials = true;
         }
         token.role = user?.role;
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user.id = token.sub as string;
            session.user.role = token.role as string;
            session.user.image = token.picture as string;
            session.user.phone = token.phone as string;
         }
         return session;
      },
   },
   jwt: {
      encode: async function (params) {
         if (params.token?.credentials) {
            const sessionToken = uuid();

            if (!params.token.sub) {
               throw new Error("No user ID found in token");
            }

            const createdSession = await adapter?.createSession?.({
               sessionToken: sessionToken,
               userId: params.token.sub,
               expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            });

            if (!createdSession) {
               throw new Error("Failed to create session");
            }

            return sessionToken;
         }
         return defaultEncode(params);
      },
   },
   pages: { signIn: "/", error: "/" },
   secret: process.env.AUTH_SECRET,
});
