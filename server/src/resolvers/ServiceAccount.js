function organization(parent, args, context) {
  if (parent.organizationId) {
    return context.prisma.organization
      .findUnique({ where: { id: parent.organizationId } });
  }
  return null;
}

function serviceType(parent, args, context) {
  if (parent.serviceTypeId) {
    return context.prisma.serviceType
      .findUnique({ where: { id: parent.serviceTypeId } });
  }
  return null;
}

export const ServiceAccount = {
  organization,
  serviceType
};