export const userInfo = (parent, args, context) => {
  const { userId, user } = context;
  if (userId && user) {
    return 'ID: ' + userId + ', User: ' + user.nameFirst + ' ' + user.nameLast + ', Email: ' + user.email + ', Account ID: ' + user.accountId;
  } else {
    return 'Not Authenticated';
  }
};

export const accounts = (parent, args, context) => {
  return context.prisma.account.findMany({
    where: { id: context.user.accountId, deleted: false },
  });
};

export const users = (parent, args, context) => {
  return context.prisma.user.findMany({
    where: { accountId: context.user.accountId, deleted: false },
  });
};
