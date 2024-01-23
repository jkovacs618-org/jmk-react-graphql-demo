export const notes = (parent, args, context, info) => {
    return context.prisma.note.findMany({
      where: { accountId: context.user.accountId, deleted: false }
    });
}
