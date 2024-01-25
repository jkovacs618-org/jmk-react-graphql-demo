export const notes = (parent, args, context) => {
  return context.prisma.note.findMany({
    where: { accountId: context.user.accountId, deleted: false }
  });
};
