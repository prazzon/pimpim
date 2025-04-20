import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Profile from "../_components/Pages/Profile/Profile";
import Main from "../_components/UI/Main/Main";
import { mockProfile } from "../_data/mock-profile";
import { getUserMedia } from "../_lib/firebase/profile/media/service";
import { getUserProfile } from "../_lib/firebase/profile/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
   title: "Your Profile",
   description: "View and manage your PimPim profile. Access your personal information, media content, comments, and likes in one place.",
   keywords: ["profile", "user profile", "account", "personal profile", "user account", "media profile"],
   alternates: {
      canonical: "/profile",
   },
   robots: {
      index: false,
      follow: true,
   },
};

export default async function ProfilePage() {
   const session = await auth();

   // Redirect to home if not authenticated
   if (!session) {
      redirect("/");
   }

   // Get the user ID from the session
   const userId = session.user.id;

   // Fetch the user's profile data from Firebase
   let profileData = await getUserProfile(userId);

   // If no profile data is found, use mock data as fallback
   if (!profileData) {
      profileData = {
         ...mockProfile,
         id: userId,
         username: session.user?.name || mockProfile.username,
         email: session.user?.email || mockProfile.email,
         profileImage: session.user?.image || mockProfile.profileImage,
      };
   } else {
      profileData = {
         ...profileData,
         username: session.user?.name || "",
         email: session.user?.email || "",
         profileImage: session.user?.image || "",
         // commentsAndLikes: mockProfile.commentsAndLikes,
      };
   }

   // Fetch the user's media items from the media collection
   const mediaItems = await getUserMedia(userId);

   return (
      <Main>
         <Profile profile={profileData} mediaItems={mediaItems} />
      </Main>
   );
}
