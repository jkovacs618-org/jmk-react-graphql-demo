export async function createCalendar(parent, args, context) {
  const calendarInput = args.calendar;
  const newCalendar = await context.prisma.calendar.create({
    data: {
      ...calendarInput,
      accountId: context.user.accountId,
      createdUserId: context.userId,
    },
  });

  if (newCalendar) {
    const calendar = await context.prisma.calendar.update({
      where: { id: newCalendar.id },
      data: {
        externalId: 'Calendar' + newCalendar.id,
      },
    });
    return calendar;
  }
  return null;
}

export async function updateCalendar(parent, args, context) {
  const model = await getCalendar(args.externalId, context);
  if (model) {
    const calendarInput = args.calendar;
    const updatedCalendar = await context.prisma.calendar.update({
      where: { id: model.id },
      data: calendarInput,
    });

    return updatedCalendar;
  } else {
    throw new Error(`Failed to find Calendar by ID: ${args.externalId} to update`);
  }
}

export async function deleteCalendar(parent, args, context) {
  const model = await getCalendar(args.externalId, context);
  if (model) {
    const deletedModel = await context.prisma.calendar.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find Calendar by ID: ${args.externalId} to delete`);
  }
}

async function getCalendar(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.calendar.findFirst({
    where: {
      externalId: externalId,
      accountId: context.user.accountId,
      deleted: false,
    },
  });
  return model;
}
