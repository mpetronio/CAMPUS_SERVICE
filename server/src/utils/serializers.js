export function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function serializeCategory(category) {
  return { id: String(category._id), name: category.name, description: category.description };
}

export function serializeRequest(request) {
  return {
    id: String(request._id),
    student: request.student ? { id: String(request.student._id), name: request.student.name, email: request.student.email } : null,
    category: request.category ? { id: String(request.category._id), name: request.category.name } : null,
    title: request.title,
    description: request.description,
    location: request.location,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}
