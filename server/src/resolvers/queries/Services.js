export const organizations = (parent, args, context, info) => {
    return context.prisma.organization.findMany({
      where: {
        AND: [
          { deleted: false },
          {
            OR: [
              { accountId: 1 },
              { accountId: context.user.accountId },
            ]
          }
        ]
      }
    });
}

export const serviceTypes = (parent, args, context, info) => {
    return context.prisma.serviceType.findMany({
      where: {
        AND: [
          { deleted: false },
          {
            OR: [
              { accountId: 1 },
              { accountId: context.user.accountId },
            ]
          }
        ]
      }
    });
}

export const serviceAccounts = (parent, args, context, info) => {
    return context.prisma.serviceAccount.findMany({
      where: {
        accountId: context.user.accountId,
        deleted: false
      }
    });
}

export const serviceAccount = (parent, args, context, info) => {
  const externalId = args.externalId
  const where = {
    externalId: externalId,
    accountId: context.user.accountId,
    deleted: false,
  }
  return context.prisma.serviceAccount.findFirst({
    where: where
  });
}

export const servicesList = async (parent, args, context, info) => {
  const where = {
    AND: [
      { accountId: context.user.accountId },
      { deleted: false },
      args.filter ? {
        OR: [
          { description: { contains: args.filter } },
          { organization: { name: { contains: args.filter } } },
          { serviceType: { name: { contains: args.filter } } },
          { accountNumber: { contains: args.filter } },
        ]
      }
      : {},
    ]
  }

  const serviceAccounts = await context.prisma.serviceAccount.findMany({
    where: where,
    skip: args.skip,
    take: args.take,
  });

  const count = await context.prisma.serviceAccount.count({
    where: where,
  });

  return {
    id: `serviceAccounts:${JSON.stringify(args)}`,
    serviceAccounts,
    count
  };
}