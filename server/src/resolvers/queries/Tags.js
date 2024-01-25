export const tags = (parent, args, context) => {
  return context.prisma.tag.findMany({
    where: { accountId: context.user.accountId, deleted: false }
  });
};