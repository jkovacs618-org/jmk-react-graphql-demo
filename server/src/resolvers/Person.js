function person1Relationship(parent, args, context) {
  return context.prisma.personRelationship
    .findFirst({ where: { person1Id: parent.id, deleted: false } });
}

function person2Relationship(parent, args, context) {
  return context.prisma.personRelationship
    .findFirst({ where: { person2Id: parent.id, deleted: false } });
}

export const Person = {
  person1Relationship,
  person2Relationship,
};