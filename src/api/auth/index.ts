import { supabase } from '@api';

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data.user) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profileData && !profileError) {
      const { error: createError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata.username || email.split('@')[0],
          role: data.user.user_metadata.role || 'user',
        },
      ]);

      if (createError) {
        console.error('Error creating profile:', createError);
      }
    }
  }

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

export const getProfile = async (userId: string) => {
  return supabase.from('profiles').select('*').eq('id', userId).single();
};

export const createProfile = async (profile: {
  id: string;
  email: string;
  username: string;
  role: string;
}) => {
  return supabase.from('profiles').insert([profile]);
};

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
    throw new Error('Неподдерживаемый формат файла');
  }

  const filePath = `avatars/${userId}/${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(`Ошибка загрузки файла: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error('Не удалось получить публичный URL');
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', userId);

  if (updateError) {
    // Можно удалить загруженный файл, если обновление профиля не прошло
    await supabase.storage.from('avatars').remove([filePath]);
    throw new Error(`Ошибка обновления профиля: ${updateError.message}`);
  }

  return urlData.publicUrl;
};

export const deleteOldAvatar = async (avatarUrl: string | null) => {
  if (!avatarUrl) return;

  try {
    const fileName = avatarUrl.split('/').pop()?.split('?')[0];
    if (!fileName) return;

    const { error } = await supabase.storage
      .from('avatars')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting old avatar:', error);
    }
  } catch (error) {
    console.error('Error in deleteOldAvatar:', error);
  }
};
