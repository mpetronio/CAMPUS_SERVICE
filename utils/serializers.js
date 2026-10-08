// Shared serializers. Clients must never see _id or __v.
// serializeUser (Dev 4) and serializeRequest (Dev 5) are added by their own tickets.

export function serializeCategory(category) {
  return {
    id: category._id.toString(),
    name: category.name,
    description: category.description,
  };
}
