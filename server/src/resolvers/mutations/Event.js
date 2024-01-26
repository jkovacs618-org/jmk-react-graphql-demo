export async function createEvent(parent, args, context) {
  // Construct input model with every property except 'calendarExternalId' input:
  const { calendarExternalId, newCalendarTitle, ...eventInput } = args.event;

  // Convert date/time inputs from String to Date objects for schema DateTime columns.
  const startDate = eventInput.startDate ? new Date(eventInput.startDate) : null;
  const endDate = eventInput.endDate ? new Date(eventInput.endDate) : null;

  // Look up the Calendar record by externalId to get the calendar.id or null for Event.
  // Create a new Calendar for this Account if the calendarExternalId value is 'NEW' and newCalendarTitle is set.
  let calendarId = null;
  if (calendarExternalId === 'NEW') {
    if (newCalendarTitle !== '') {
      const calendar = await createCalendar(newCalendarTitle, context);
      calendarId = calendar ? calendar.id : null;
    }
  } else {
    const calendar = await getCalendar(calendarExternalId, context);
    calendarId = calendar ? calendar.id : null;
  }

  const newEvent = await context.prisma.event.create({
    data: {
      ...eventInput,
      accountId: context.user.accountId,
      calendarId: calendarId,
      startDate: startDate,
      endDate: endDate,
      createdUserId: context.userId,
    },
  });

  if (newEvent) {
    const event = await context.prisma.event.update({
      where: { id: newEvent.id },
      data: {
        externalId: 'Event' + newEvent.id,
      },
    });
    return event;
  }
  return null;
}

export async function updateEvent(parent, args, context) {
  const model = await getEvent(args.externalId, context);
  if (model) {
    // Construct input model with every property except 'calendarExternalId' input:
    const { calendarExternalId, newCalendarTitle, ...eventInput } = args.event;

    // Convert date/time inputs from String to Date objects for schema DateTime columns.
    const startDate = eventInput.startDate ? new Date(eventInput.startDate) : null;
    const endDate = eventInput.endDate ? new Date(eventInput.endDate) : null;

    // Look up the Calendar record by externalId to get the calendar.id or null for Event.
    // Create a new Calendar for this Account if the calendarExternalId value is 'NEW' and newCalendarTitle is set.
    let calendarId = null;
    if (calendarExternalId === 'NEW') {
      if (newCalendarTitle !== '') {
        const calendar = await createCalendar(newCalendarTitle, context);
        calendarId = calendar ? calendar.id : null;
      }
    } else {
      const calendar = await getCalendar(calendarExternalId, context);
      calendarId = calendar ? calendar.id : null;
    }

    const updatedEvent = await context.prisma.event.update({
      where: { id: model.id },
      data: {
        ...eventInput,
        calendarId: calendarId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    return updatedEvent;
  } else {
    throw new Error(`Failed to find Event by ID: ${args.externalId} to update`);
  }
}

export async function deleteEvent(parent, args, context) {
  const model = await getEvent(args.externalId, context);
  if (model) {
    const deletedModel = await context.prisma.event.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find Event by ID: ${args.externalId} to delete`);
  }
}

export async function getEvent(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.event.findFirst({
    where: {
      externalId: externalId,
      accountId: context.user.accountId,
      deleted: false,
    },
  });
  return model;
}

export async function getCalendar(externalId, context) {
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

async function createCalendar(newCalendarTitle, context) {
  const newCalendar = await context.prisma.calendar.create({
    data: {
      accountId: context.user.accountId,
      title: newCalendarTitle,
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
