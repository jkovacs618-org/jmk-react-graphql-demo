function users(parent, args, context) {
  return context.prisma.account
    .findUnique({ where: { id: parent.id, deleted: false } })
    .users();
}

function persons(parent, args, context) {
  return context.prisma.account
    .findUnique({ where: { id: parent.id, deleted: false } })
    .persons();
}

function events(parent, args, context) {
  return context.prisma.account
    .findUnique({ where: { id: parent.id, deleted: false } })
    .events();
}

function serviceAccounts(parent, args, context) {
  return context.prisma.account
    .findUnique({ where: { id: parent.id, deleted: false } })
    .serviceAccounts();
}

function notes(parent, args, context) {
  return context.prisma.account
    .findUnique({ where: { id: parent.id, deleted: false } })
    .notes();
}

function tags(parent, args, context) {
  return context.prisma.account
    .findUnique({ where: { id: parent.id, deleted: false } })
    .tags();
}

export const Account = {
  users,
  persons,
  events,
  serviceAccounts,
  notes,
  tags
};