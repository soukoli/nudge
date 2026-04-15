import type { 
  MemberType, 
  AssetType, 
  NudgeCategory, 
  NudgeVisibility, 
  NudgeFrequency 
} from '@/generated/prisma/client';

// Re-export enums for convenience
export type { MemberType, AssetType, NudgeCategory, NudgeVisibility, NudgeFrequency };

// ===== Family Types =====
export type CreateFamilyInput = {
  name: string;
  members?: CreateMemberInput[];
  assets?: CreateAssetInput[];
};

export type UpdateFamilyInput = {
  name?: string;
};

// ===== Member Types =====
export type CreateMemberInput = {
  name: string;
  nickname?: string;
  avatarUrl?: string;
  birthDate?: string; // ISO date string
  memberType?: MemberType;
};

export type UpdateMemberInput = Partial<CreateMemberInput>;

// ===== Asset Types =====
export type CreateAssetInput = {
  name: string;
  assetType: AssetType;
  description?: string;
  imageUrl?: string;
};

export type UpdateAssetInput = Partial<CreateAssetInput>;

// ===== Nudge Types =====
export type CreateNudgeInput = {
  title: string;
  description?: string;
  emoji?: string;
  category: NudgeCategory;
  memberId?: string;        // Related to a family member
  assetId?: string;         // Related to an asset
  visibility?: NudgeVisibility;
  targetMemberId?: string;  // If personal, who should see this
  frequency?: NudgeFrequency;
  frequencyDays?: number[]; // For CUSTOM frequency
};

export type UpdateNudgeInput = {
  title?: string;
  description?: string;
  emoji?: string;
  category?: NudgeCategory;
  visibility?: NudgeVisibility;
  targetMemberId?: string | null;
  frequency?: NudgeFrequency;
  frequencyDays?: number[];
  isActive?: boolean;
};

// ===== API Response Types =====
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// ===== Nudge Template Type =====
export type NudgeTemplateData = {
  id: string;
  title: string;
  titleKey?: string;
  description?: string;
  emoji?: string;
  category: NudgeCategory;
  applicableTo: 'MEMBER' | 'ASSET' | 'FAMILY' | 'ANY';
  memberTypes: MemberType[];
  assetTypes: AssetType[];
  defaultFrequency: NudgeFrequency;
  isBuiltIn: boolean;
  usageCount: number;
  likeCount: number;
};

// ===== UI Types =====
export type FamilyMemberWithNudges = {
  id: string;
  name: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  memberType: MemberType;
  birthDate?: Date | null;
  nudgeCount: number;
  completedToday: number;
};

export type NudgeWithMember = {
  id: string;
  title: string;
  description?: string | null;
  emoji?: string | null;
  category: NudgeCategory;
  visibility: NudgeVisibility;
  frequency: NudgeFrequency;
  isActive: boolean;
  lastDoneAt?: Date | null;
  member?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  } | null;
  asset?: {
    id: string;
    name: string;
    assetType: AssetType;
  } | null;
};

// ===== Current User Context =====
export type CurrentUser = {
  memberId: string;
  name: string;
  avatarUrl?: string | null;
};

// ===== Legacy Check Types (for backwards compatibility) =====
// These map to the new Nudge types
export type CreateCheckInput = CreateNudgeInput;
export type UpdateCheckInput = UpdateNudgeInput;
