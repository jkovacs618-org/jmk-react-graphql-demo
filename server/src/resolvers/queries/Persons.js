export const persons = (parent, args, context, info) => {
    return context.prisma.person.findMany({
      where: { accountId: context.user.accountId, deleted: false }
    });
}

export const person = (parent, args, context, info) => {
  const externalId = args.externalId
  const where = {
    externalId: externalId,
    accountId: context.user.accountId,
    deleted: false,
  }
  return context.prisma.person.findFirst({
    where: where
  });
}

export const personsList = async (parent, args, context, info) => {
  const where = {
    AND: [
      { accountId: context.user.accountId },
      { deleted: false },
      args.filter ? {
        OR: [
          { nameFirst: { contains: args.filter } },
          { nameMiddle: { contains: args.filter } },
          { nameLast: { contains: args.filter } },
          { gender: { equals: args.filter } },
          // Not Working: { person2Relationship: { type: { contains: args.filter } } },
        ]
      }
      : {},
    ]
  }

  const persons = await context.prisma.person.findMany({
    where: where,
    skip: args.skip,
    take: args.take,
  });

  const count = await context.prisma.person.count({
    where: where,
  });

  return {
    id: `persons:${JSON.stringify(args)}`,
    persons,
    count
  };
}