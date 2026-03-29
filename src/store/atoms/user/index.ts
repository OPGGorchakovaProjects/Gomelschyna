import { atom } from 'jotai';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface User extends SupabaseUser {
  role: UserRole;
}

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar_url?: string | null;
}

export const profileAtom = atom<UserProfile | null>(null);
export const profileLoadingAtom = atom<boolean>(true); 