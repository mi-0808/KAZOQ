import { getProfileBoardData } from "@/lib/repositories/profiles";
import { ProfileBoard } from "@/components/profile/profile-board";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";

export default async function ProfilePage() {
  const profileBoard = await getProfileBoardData();

  return (
    <>
      <RealtimeRefresh tables={["profiles", "family_members", "families"]} />
      <ProfileBoard family={profileBoard.family} profiles={profileBoard.profiles} currentProfile={profileBoard.currentProfile} />
    </>
  );
}
