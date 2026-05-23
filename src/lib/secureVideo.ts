import { supabase } from './supabase';

const signedUrlExpiresIn = 60 * 10;

export function getCourseStoragePath(videoUrl?: string | null) {
  if (!videoUrl) return null;
  if (!/^https?:\/\//i.test(videoUrl)) return videoUrl.replace(/^\/+/, '');

  try {
    const url = new URL(videoUrl);
    const marker = '/storage/v1/object/public/courses/';
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function getSignedCourseVideoUrl(videoUrl?: string | null) {
  const storagePath = getCourseStoragePath(videoUrl);
  if (!storagePath) return undefined;

  const { data, error } = await supabase.storage
    .from('courses')
    .createSignedUrl(storagePath, signedUrlExpiresIn);

  if (error) {
    console.warn('Could not create signed video URL:', error);
    return undefined;
  }

  return data.signedUrl;
}
