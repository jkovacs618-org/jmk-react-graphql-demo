export const calendars = (parent, args, context, info) => {
    return context.prisma.calendar.findMany({
      where: { accountId: context.user.accountId, deleted: false }
    });
}
