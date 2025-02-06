import { getUserProfile } from "@/lib/firebase/firebaseUtils";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const profile = await getUserProfile(params.userId);
  
  if (!profile) {
    notFound();
  }

  return (
    <div className="pb-20">
      <ProfileHeader profile={profile} />
      <ProfilePosts userId={params.userId} />
    </div>
  );
} 