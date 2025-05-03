import { auth } from "@/auth";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import UserProfile from "../../_components/Pages/Profile/UserProfile/UserProfile";
import Main from "../../_components/UI/Main/Main";
import { getUserMedia } from "../../_lib/firebase/profile/media/service";
import { getUserProfileByUsername } from "../../_lib/firebase/profile/service";

export const dynamic = "force-dynamic";

type Props = {
   params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { username } = await params;
   const profile = await getUserProfileByUsername(username);

   if (!profile) {
      return {
         title: "User Not Found",
         description: "The requested user profile could not be found.",
      };
   }

   return {
      title: `${profile.displayName || profile.username}'s Profile`,
      description: `View ${
         profile.displayName || profile.username
      }'s profile on PimPim.`,
      keywords: [
         "profile",
         "user profile",
         "personal profile",
         "media profile",
         profile.username,
         profile.displayName || "",
      ],
      alternates: {
         canonical: `/user/${username}`,
      },
   };
}

export default async function UserProfilePage({ params }: Props) {
   const { username } = await params;
   const session = await auth();

   // Get the user's profile data by username
   const profile = await getUserProfileByUsername(username);

   // If no profile is found, return 404
   if (!profile) {
      notFound();
   }

   // Check if the current user is viewing their own profile
   const isCurrentUser = session?.user.id === profile.id;

   // If the current user is viewing their own profile, redirect to /profile
   if (isCurrentUser) {
      redirect("/profile");
   }

   const isPrivate = profile.isPrivate === true;

   // Fetch the user's media items
   const mediaItems = isPrivate ? [] : await getUserMedia(profile.id);

   return (
      <Main>
         <UserProfile profile={profile} mediaItems={mediaItems} />
      </Main>
   );
}
