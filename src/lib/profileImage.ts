import { supabase } from './supabase';

export function imageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadProfileImage(userId: string, dataUrl: string) {
  const fileExt = (dataUrl.substring('data:image/'.length, dataUrl.indexOf(';base64')) || 'png').toLowerCase();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, blob, {
      contentType: `image/${fileExt}`,
      upsert: false,
    });

  if (error) {
    if (/bucket/i.test(error.message)) {
      throw new Error("The 'avatars' storage bucket is missing or unavailable. Run the storage setup SQL, then try again.");
    }
    throw error;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
  return data.publicUrl;
}
