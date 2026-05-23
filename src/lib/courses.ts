import { Course } from '../types';
import { supabase } from './supabase';
import { getSignedCourseVideoUrl } from './secureVideo';

type RawCourse = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  rating?: number | null;
  price?: number | null;
  thumbnail?: string | null;
  video_url?: string | null;
  type?: 'video' | 'text' | null;
  duration?: string | null;
  instructor_id?: string | null;
};

const defaultThumbnail = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80';
const defaultAvatar = 'https://ui-avatars.com/api/?name=AI&background=00154d&color=fff';

export async function fetchPaidCourses(): Promise<Course[]> {
  const { data: functionData, error: functionError } = await supabase.functions.invoke('list-paid-courses', {
    method: 'POST',
  });

  if (!functionError && Array.isArray(functionData?.courses)) {
    return functionData.courses;
  }

  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, category, rating, price, thumbnail, video_url, type, duration, instructor_id')
    .eq('status', 'published')
    .gt('price', 0)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(functionError?.message || error.message || 'Unable to load paid courses.');
  }

  const instructorIds = [...new Set((data || []).map((course: RawCourse) => course.instructor_id).filter(Boolean))];
  const { data: profiles } = instructorIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', instructorIds)
    : { data: [] };
  const profilesById = new Map((profiles || []).map((profile: any) => [profile.id, profile]));

  return Promise.all((data || []).map(async (course: RawCourse) => {
    const instructor = profilesById.get(course.instructor_id);
    return {
      id: course.id,
      title: course.title,
      description: course.description || 'A practical paid course from Nigeria AI School.',
      category: course.category || 'AI & ML',
      rating: course.rating || 0,
      reviewsCount: 0,
      price: Math.max(Number(course.price || 0), 15000),
      thumbnail: course.thumbnail || defaultThumbnail,
      duration: course.duration || 'Self-paced',
      videoUrl: await getSignedCourseVideoUrl(course.video_url),
      type: course.type || 'video',
      instructor: {
        name: `${instructor?.first_name || 'Expert'} ${instructor?.last_name || 'Instructor'}`.trim(),
        role: 'Course Creator',
        avatar: instructor?.avatar_url || defaultAvatar,
      },
    };
  }));
}
