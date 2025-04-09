import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileEditForm from "../../_components/Pages/Profile/ProfileEdit/ProfileEditForm";
import Main from "../../_components/UI/Main/Main";
import { getUserProfile } from "../../_lib/firebase/profile/service";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
   const session = await auth();

   // Redirect to home if not authenticated
   if (!session) {
      redirect("/");
   }

   // Get the user ID from the session
   const userId = session.user.id;

   // Fetch the user's profile data from Firebase
   let profileData = await getUserProfile(userId);

   if (!profileData) return null;

   profileData = {
      ...profileData,
      username: session.user?.name || "",
      email: session.user?.email || "",
      profileImage: session.user?.image || "",
   };

   return (
      <Main>
         <ProfileEditForm profile={profileData} />
      </Main>
   );
}
