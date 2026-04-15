'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse, CreateMemberInput, CreateAssetInput, CreateNudgeInput, UpdateNudgeInput } from '@/lib/types';

// ===== Types =====
export interface Family {
  id: string;
  name: string;
  shareCode: string;
  createdAt: string;
  updatedAt: string;
  members: FamilyMember[];
  assets: Asset[];
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  birthDate?: string | null;
  memberType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  familyId: string;
  name: string;
  assetType: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Nudge {
  id: string;
  familyId: string;
  title: string;
  description?: string | null;
  emoji?: string | null;
  category: string;
  memberId?: string | null;
  assetId?: string | null;
  visibility: 'SHARED' | 'PERSONAL';
  targetMemberId?: string | null;
  frequency: string;
  frequencyDays: number[];
  isActive: boolean;
  lastShownAt?: string | null;
  lastDoneAt?: string | null;
  createdAt: string;
  updatedAt: string;
  member?: { id: string; name: string; avatarUrl?: string | null; memberType: string } | null;
  asset?: { id: string; name: string; assetType: string } | null;
  targetMember?: { id: string; name: string } | null;
  completions?: { id: string; completedAt: string; completedBy?: string | null }[];
}

// ===== Family Storage (simple localStorage for demo) =====
const FAMILY_ID_KEY = 'keepclose_family_id';
const MEMBER_ID_KEY = 'keepclose_member_id';

export function getFamilyId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(FAMILY_ID_KEY);
}

export function setFamilyId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAMILY_ID_KEY, id);
}

export function clearFamilyId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAMILY_ID_KEY);
}

export function getCurrentMemberId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(MEMBER_ID_KEY);
}

export function setCurrentMemberId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMBER_ID_KEY, id);
}

export function clearCurrentMemberId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MEMBER_ID_KEY);
}

// ===== useFamily Hook =====
export function useFamily() {
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFamily = useCallback(async (id?: string) => {
    const familyId = id || getFamilyId();
    if (!familyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/family?id=${familyId}`);
      const data: ApiResponse<Family> = await res.json();

      if (data.success) {
        setFamily(data.data);
        setFamilyId(data.data.id);
      } else {
        setError(data.error);
        clearFamilyId();
      }
    } catch (err) {
      setError('Failed to fetch family');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFamily = useCallback(async (name: string): Promise<Family | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data: ApiResponse<Family> = await res.json();

      if (data.success) {
        setFamily(data.data);
        setFamilyId(data.data.id);
        return data.data;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError('Failed to create family');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinFamily = useCallback(async (shareCode: string): Promise<Family | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/family?shareCode=${shareCode}`);
      const data: ApiResponse<Family> = await res.json();

      if (data.success) {
        setFamily(data.data);
        setFamilyId(data.data.id);
        return data.data;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError('Failed to join family');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFamily = useCallback(async (updates: { name?: string }): Promise<Family | null> => {
    if (!family?.id) return null;

    try {
      const res = await fetch('/api/family', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: family.id, ...updates }),
      });
      const data: ApiResponse<Family> = await res.json();

      if (data.success) {
        setFamily(data.data);
        return data.data;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError('Failed to update family');
      console.error(err);
      return null;
    }
  }, [family?.id]);

  useEffect(() => {
    fetchFamily();
  }, [fetchFamily]);

  return {
    family,
    loading,
    error,
    fetchFamily,
    createFamily,
    joinFamily,
    updateFamily,
    hasFamily: !!family,
  };
}

// ===== useMembers Hook =====
export function useMembers(familyId: string | undefined) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/members?familyId=${familyId}`);
      const data: ApiResponse<FamilyMember[]> = await res.json();

      if (data.success) {
        setMembers(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  const addMember = useCallback(async (input: CreateMemberInput): Promise<FamilyMember | null> => {
    if (!familyId) return null;

    try {
      const res = await fetch(`/api/members?familyId=${familyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data: ApiResponse<FamilyMember> = await res.json();

      if (data.success) {
        setMembers(prev => [...prev, data.data]);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [familyId]);

  const deleteMember = useCallback(async (memberId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/members?id=${memberId}`, {
        method: 'DELETE',
      });
      const data: ApiResponse<{ deleted: boolean }> = await res.json();

      if (data.success) {
        setMembers(prev => prev.filter(m => m.id !== memberId));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    deleteMember,
  };
}

// ===== useAssets Hook =====
export function useAssets(familyId: string | undefined) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/assets?familyId=${familyId}`);
      const data: ApiResponse<Asset[]> = await res.json();

      if (data.success) {
        setAssets(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch assets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  const addAsset = useCallback(async (input: CreateAssetInput): Promise<Asset | null> => {
    if (!familyId) return null;

    try {
      const res = await fetch(`/api/assets?familyId=${familyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data: ApiResponse<Asset> = await res.json();

      if (data.success) {
        setAssets(prev => [...prev, data.data]);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [familyId]);

  const deleteAsset = useCallback(async (assetId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/assets?id=${assetId}`, {
        method: 'DELETE',
      });
      const data: ApiResponse<{ deleted: boolean }> = await res.json();

      if (data.success) {
        setAssets(prev => prev.filter(a => a.id !== assetId));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    addAsset,
    deleteAsset,
  };
}

// ===== useNudges Hook =====
export function useNudges(familyId: string | undefined, memberId?: string | null) {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNudges = useCallback(async (visibility?: 'shared' | 'personal' | 'all') => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = `/api/nudges?familyId=${familyId}`;
      if (memberId) url += `&memberId=${memberId}`;
      if (visibility) url += `&visibility=${visibility}`;

      const res = await fetch(url);
      const data: ApiResponse<Nudge[]> = await res.json();

      if (data.success) {
        setNudges(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch nudges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [familyId, memberId]);

  const addNudge = useCallback(async (input: CreateNudgeInput): Promise<Nudge | null> => {
    if (!familyId) return null;

    try {
      const res = await fetch(`/api/nudges?familyId=${familyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data: ApiResponse<Nudge> = await res.json();

      if (data.success) {
        setNudges(prev => [...prev, data.data]);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [familyId]);

  const updateNudge = useCallback(async (nudgeId: string, updates: UpdateNudgeInput): Promise<Nudge | null> => {
    try {
      const res = await fetch('/api/nudges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nudgeId, ...updates }),
      });
      const data: ApiResponse<Nudge> = await res.json();

      if (data.success) {
        setNudges(prev => prev.map(n => n.id === nudgeId ? data.data : n));
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const completeNudge = useCallback(async (nudgeId: string, note?: string): Promise<void> => {
    try {
      const res = await fetch('/api/nudges/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nudgeId, memberId, note }),
      });
      const data: ApiResponse<any> = await res.json();

      if (data.success) {
        // Update the nudge in state with new lastDoneAt
        setNudges(prev => prev.map(n => 
          n.id === nudgeId 
            ? { ...n, lastDoneAt: new Date().toISOString() }
            : n
        ));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [memberId]);

  const deleteNudge = useCallback(async (nudgeId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/nudges?id=${nudgeId}`, {
        method: 'DELETE',
      });
      const data: ApiResponse<{ deleted: boolean }> = await res.json();

      if (data.success) {
        setNudges(prev => prev.filter(n => n.id !== nudgeId));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchNudges();
  }, [fetchNudges]);

  // Derived data
  const sharedNudges = nudges.filter(n => n.visibility === 'SHARED');
  const personalNudges = nudges.filter(n => n.visibility === 'PERSONAL');
  const todayNudges = nudges.filter(n => {
    // Filter nudges that should show today based on frequency
    // For now, just return all active nudges
    return n.isActive;
  });

  return {
    nudges,
    sharedNudges,
    personalNudges,
    todayNudges,
    loading,
    error,
    fetchNudges,
    addNudge,
    updateNudge,
    completeNudge,
    deleteNudge,
  };
}

// ===== useCurrentMember Hook =====
export function useCurrentMember(members: FamilyMember[]) {
  const [currentMemberId, setCurrentMemberIdState] = useState<string | null>(null);

  useEffect(() => {
    const stored = getCurrentMemberId();
    if (stored && members.some(m => m.id === stored)) {
      setCurrentMemberIdState(stored);
    } else if (members.length > 0) {
      // Auto-select first adult if no member selected
      const adult = members.find(m => m.memberType === 'ADULT');
      if (adult) {
        setCurrentMemberIdState(adult.id);
        setCurrentMemberId(adult.id);
      }
    }
  }, [members]);

  const selectMember = useCallback((memberId: string) => {
    setCurrentMemberIdState(memberId);
    setCurrentMemberId(memberId);
  }, []);

  const currentMember = members.find(m => m.id === currentMemberId) || null;

  return {
    currentMemberId,
    currentMember,
    selectMember,
  };
}
