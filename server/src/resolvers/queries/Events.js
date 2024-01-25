export const eventsList = async (parent, args, context) => {
  const where = {
    AND: [
      { accountId: context.user.accountId },
      { deleted: false },
      args.filter ? {
        OR: [
          { title: { contains: args.filter } },
          { location: { contains: args.filter } },
        ]
      }
        : {},
    ]
  };

  const events = await context.prisma.event.findMany({
    where: where,
    skip: args.skip,
    take: args.take,
  });

  const count = await context.prisma.event.count({
    where: where,
  });

  return {
    id: `events:${JSON.stringify(args)}`,
    events,
    count
  };
};

export const events = (parent, args, context) => {
  const where = {
    accountId: context.user.accountId,
    deleted: false,
  };
  return context.prisma.event.findMany({
    where: where
  });
};

export const event = (parent, args, context) => {
  const externalId = args.externalId;
  const where = {
    externalId: externalId,
    accountId: context.user.accountId,
    deleted: false,
  };
  return context.prisma.event.findFirst({
    where: where
  });
};