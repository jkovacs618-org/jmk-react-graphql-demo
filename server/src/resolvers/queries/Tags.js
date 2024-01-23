export const tags = (parent, args, context, info) => {
    return context.prisma.tag.findMany({
      where: { accountId: context.user.accountId, deleted: false }
    });
}
