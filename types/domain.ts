export type FamilyRole = "親" | "子" | "祖父母" | "保護者" | "その他";

export type MessageCategory =
  | "雑談"
  | "ご飯"
  | "買い物"
  | "家事"
  | "予定"
  | "部活・習い事";

export type TemplateType =
  | "meal"
  | "shopping"
  | "chore"
  | "schedule"
  | "activity";

export type MoodType = "にこにこ" | "おだやか" | "がんばった" | "つかれた" | "しんぱい";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Profile {
  userId: string;
  name: string;
  familyRole: FamilyRole;
  avatar: string;
  organization: string;
  activities: string[];
  bio: string;
  status: string;
  accentColor: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  roleLabel: FamilyRole;
  relationLabel: string;
}

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
  members: FamilyMember[];
}

export interface MessageTemplatePayload {
  title: string;
  fields: {
    label: string;
    value: string;
  }[];
}

export interface Message {
  id: string;
  familyId: string;
  authorId: string;
  category: MessageCategory;
  body: string;
  createdAt: string;
  readBy: string[];
  templateType?: TemplateType;
  templatePayload?: MessageTemplatePayload;
}

export interface ScheduleItem {
  id: string;
  familyId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  ownerId?: string;
  placeId?: string;
  type: "家族" | "個人";
  sourceMessageId?: string;
  note?: string;
}

export interface PlaceRegistration {
  id: string;
  familyId: string;
  name: string;
  category: "学校" | "習い事" | "塾" | "職場" | "旅行先" | "その他";
  address: string;
  lat: number;
  lng: number;
  color: string;
}

export interface FamilyLocation {
  id: string;
  userId: string;
  label: string;
  updatedAt: string;
  placeId?: string;
}

export interface DiaryEntry {
  id: string;
  familyId: string;
  authorId: string;
  date: string;
  mood: MoodType;
  todayStory: string;
  happyMoment: string;
  concern: string;
  messageToFamily: string;
  reactions: DiaryReaction[];
}

export interface DiaryReaction {
  id: string;
  entryId: string;
  userId: string;
  emoji: string;
}

export interface HomeShortcut {
  id: string;
  label: string;
  description: string;
  href: string;
}
