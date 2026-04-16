import { family, profiles, users } from "@/data/mock-data";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { Family, FamilyMember, Profile } from "@/types/domain";
import type { Database } from "@/types/supabase";

export interface ProfileBoardData {
  family: Family;
  profiles: Profile[];
  currentProfile: Profile;
}

function mapProfile(
  profile: Database["public"]["Tables"]["profiles"]["Row"],
  user: Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "name"> | undefined
): Profile {
  return {
    userId: profile.user_id,
    name: profile.display_name || user?.name || "家族メンバー",
    familyRole: profile.family_role as Profile["familyRole"],
    avatar: profile.avatar_path ?? (profile.display_name || user?.name || "?").slice(0, 1),
    organization: profile.organization ?? "",
    activities: profile.activities ?? [],
    bio: profile.bio ?? "",
    status: profile.status ?? "",
    accentColor: profile.accent_color ?? "bg-blush"
  };
}

export async function getProfileBoardData(familyId?: string): Promise<ProfileBoardData> {
  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;

  if (!resolvedFamilyId) {
    throw new Error("Family membership not found.");
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();

    const { data: memberships, error: membershipError } = await supabase
      .from("family_members")
      .select("id, family_id, user_id, role_label, relation_label")
      .eq("family_id", resolvedFamilyId)
      .returns<
        Pick<
          Database["public"]["Tables"]["family_members"]["Row"],
          "id" | "family_id" | "user_id" | "role_label" | "relation_label"
        >[]
      >();

    if (membershipError) {
      throw membershipError;
    }

    if (!memberships || memberships.length === 0) {
      throw new Error("Family members could not be loaded.");
    }

    const userIds = memberships.map((member) => member.user_id);
    const [profilesResult, usersResult, familyResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, display_name, avatar_path, family_role, organization, activities, bio, status, accent_color, updated_at")
        .in("user_id", userIds)
        .returns<Database["public"]["Tables"]["profiles"]["Row"][]>(),
      supabase.from("users").select("id, name").in("id", userIds).returns<Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "name">[]>(),
      supabase
        .from("families")
        .select("id, name, invite_code")
        .eq("id", resolvedFamilyId)
        .limit(1)
        .maybeSingle<Pick<Database["public"]["Tables"]["families"]["Row"], "id" | "name" | "invite_code">>()
    ]);

    if (profilesResult.error || usersResult.error || familyResult.error) {
      throw profilesResult.error ?? usersResult.error ?? familyResult.error;
    }

    const userMap = new Map((usersResult.data ?? []).map((user) => [user.id, user]));
    const profileMap = new Map((profilesResult.data ?? []).map((profile) => [profile.user_id, mapProfile(profile, userMap.get(profile.user_id))]));
    const members: FamilyMember[] = memberships.map((member) => ({
      id: member.id,
      familyId: member.family_id,
      userId: member.user_id,
      roleLabel: member.role_label as FamilyMember["roleLabel"],
      relationLabel: member.relation_label ?? ""
    }));

    const familyProfiles = members.map((member) => {
      const profile = profileMap.get(member.userId);
      if (profile) return profile;
      const user = userMap.get(member.userId);
      return {
        userId: member.userId,
        name: user?.name ?? "家族メンバー",
        familyRole: member.roleLabel,
        avatar: (user?.name ?? "?").slice(0, 1),
        organization: "",
        activities: [],
        bio: "",
        status: "",
        accentColor: "bg-blush"
      };
    });

    const currentProfile = familyProfiles.find((profile) => profile.userId === context.appUserId) ?? familyProfiles[0];

    if (!currentProfile) {
      throw new Error("Current profile could not be resolved.");
    }

    return {
      family: {
        id: familyResult.data?.id ?? resolvedFamilyId,
        name: familyResult.data?.name ?? "",
        inviteCode: familyResult.data?.invite_code ?? "",
        members
      },
      profiles: familyProfiles,
      currentProfile
    };
  }

  const members: FamilyMember[] = family.members;
  const userMap = new Map(users.map((user) => [user.id, user]));
  const familyProfiles = members.map((member) => {
    const profile = profiles.find((item) => item.userId === member.userId);
    if (profile) return profile;
    const user = userMap.get(member.userId);
    return {
      userId: member.userId,
      name: user?.name ?? "家族メンバー",
      familyRole: member.roleLabel,
      avatar: (user?.name ?? "?").slice(0, 1),
      organization: "",
      activities: [],
      bio: "",
      status: "",
      accentColor: "bg-blush"
    };
  });

  const currentProfile = familyProfiles.find((profile) => profile.userId === context.appUserId) ?? familyProfiles[0];

  if (!currentProfile) {
    throw new Error("Current profile could not be resolved.");
  }

  return {
    family: {
      id: family.id,
      name: family.name,
      inviteCode: family.inviteCode,
      members
    },
    profiles: familyProfiles,
    currentProfile
  };
}

export async function updateProfile(input: {
  userId: string;
  name: string;
  familyRole: string;
  organization: string;
  bio: string;
  status: string;
  activities: string[];
}) {
  if (!isSupabaseConfigured()) {
    return { mode: "demo" as const, id: input.userId, input };
  }

  const supabase = await createClient();
  const { error: userError } = await supabase
    .from("users")
    .update({
      name: input.name
    })
    .eq("id", input.userId);

  if (userError) {
    throw userError;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: input.name,
      family_role: input.familyRole,
      organization: input.organization,
      bio: input.bio,
      status: input.status,
      activities: input.activities,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", input.userId);

  if (profileError) {
    throw profileError;
  }

  return { mode: "supabase" as const, id: input.userId };
}
