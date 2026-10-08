export const STUDENT_ROLE = 'student';
export const STAFF_ROLE = 'staff';

export function isValidRole(role) {
  return role === STUDENT_ROLE || role === STAFF_ROLE;
}
