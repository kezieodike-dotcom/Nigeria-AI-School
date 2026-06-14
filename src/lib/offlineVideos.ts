import { Course } from '../types';

const dbName = 'nigeria-ai-school-offline';
const dbVersion = 1;
const storeName = 'videos';

export type OfflineVideo = {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  thumbnail: string;
  duration: string;
  instructorName: string;
  category: string;
  size: number;
  mimeType: string;
  downloadedAt: string;
  expiresAt: string;
  blob: Blob;
};

type OfflineVideoInput = {
  course: Course;
  userId: string;
  sourceUrl: string;
  expiresAt: string;
  onProgress?: (progress: number) => void;
};

function openOfflineDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Offline downloads are not available in this browser.'));
      return;
    }

    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'id' });
        store.createIndex('userId', 'userId');
        store.createIndex('courseId', 'courseId');
      }
    };

    request.onerror = () => reject(request.error || new Error('Could not open offline storage.'));
    request.onsuccess = () => resolve(request.result);
  });
}

function runStoreRequest<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
) {
  return openOfflineDb().then((db) => new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = callback(transaction.objectStore(storeName));

    request.onerror = () => reject(request.error || new Error('Offline storage request failed.'));
    request.onsuccess = () => resolve(request.result);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error('Offline storage transaction failed.'));
    };
  }));
}

export function getOfflineVideoId(userId: string, courseId: string) {
  return `${userId}:${courseId}`;
}

export async function getOfflineVideo(userId: string, courseId: string) {
  return runStoreRequest<OfflineVideo | undefined>('readonly', (store) =>
    store.get(getOfflineVideoId(userId, courseId))
  );
}

export async function listOfflineVideos(userId: string) {
  const videos = await runStoreRequest<OfflineVideo[]>('readonly', (store) => store.getAll());
  return videos
    .filter((video) => video.userId === userId)
    .sort((left, right) => new Date(right.downloadedAt).getTime() - new Date(left.downloadedAt).getTime());
}

export async function deleteOfflineVideo(userId: string, courseId: string) {
  await runStoreRequest<undefined>('readwrite', (store) =>
    store.delete(getOfflineVideoId(userId, courseId)) as IDBRequest<undefined>
  );
}

async function fetchVideoBlob(sourceUrl: string, onProgress?: (progress: number) => void) {
  const response = await fetch(sourceUrl, { credentials: 'omit' });
  if (!response.ok) {
    throw new Error('Could not download this video for offline viewing.');
  }

  const contentLength = Number(response.headers.get('content-length') || 0);
  if (!response.body || !contentLength) {
    const blob = await response.blob();
    onProgress?.(100);
    return blob;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    chunks.push(value);
    received += value.length;
    onProgress?.(Math.min(99, Math.round((received / contentLength) * 100)));
  }

  onProgress?.(100);
  return new Blob(chunks, {
    type: response.headers.get('content-type') || 'video/mp4',
  });
}

export async function saveOfflineVideo({ course, userId, sourceUrl, expiresAt, onProgress }: OfflineVideoInput) {
  const blob = await fetchVideoBlob(sourceUrl, onProgress);
  const offlineVideo: OfflineVideo = {
    id: getOfflineVideoId(userId, course.id),
    userId,
    courseId: course.id,
    title: course.title,
    thumbnail: course.thumbnail,
    duration: course.duration,
    instructorName: course.instructor.name,
    category: course.category,
    size: blob.size,
    mimeType: blob.type || 'video/mp4',
    downloadedAt: new Date().toISOString(),
    expiresAt,
    blob,
  };

  await runStoreRequest<IDBValidKey>('readwrite', (store) => store.put(offlineVideo));
  return offlineVideo;
}

export function isOfflineVideoPlayable(video?: OfflineVideo | null) {
  return Boolean(video && new Date(video.expiresAt).getTime() > Date.now());
}

export function formatOfflineVideoSize(size = 0) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
