function calendar(parent, args, context) {
  return context.prisma.calendar
    .findUnique({ where: { id: parent.calendarId, deleted: false } });
}

export const Event = {
  calendar
};