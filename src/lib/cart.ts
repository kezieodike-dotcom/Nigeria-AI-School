import { Course } from '../types';

export type CartCourse = Pick<Course, 'id' | 'title' | 'price' | 'thumbnail' | 'duration'>;

const cartKey = 'nais_cart_courses';

export function getCartCourses(): CartCourse[] {
  try {
    const rawCart = window.localStorage.getItem(cartKey);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch {
    return [];
  }
}

export function addCourseToCart(course: Course): { added: boolean; cart: CartCourse[] } {
  const cart = getCartCourses();
  const exists = cart.some((item) => item.id === course.id);

  if (!exists) {
    cart.push({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      duration: course.duration,
    });
    window.localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  window.dispatchEvent(new CustomEvent('nais-cart-updated', { detail: cart }));
  return { added: !exists, cart };
}

export function removeCourseFromCart(courseId: string): CartCourse[] {
  const cart = getCartCourses().filter((item) => item.id !== courseId);
  window.localStorage.setItem(cartKey, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('nais-cart-updated', { detail: cart }));
  return cart;
}

export function clearCart() {
  window.localStorage.removeItem(cartKey);
  window.dispatchEvent(new CustomEvent('nais-cart-updated', { detail: [] }));
}
