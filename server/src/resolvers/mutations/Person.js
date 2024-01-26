export async function createPerson(parent, args, context) {
  // Construct input model with every property except 'relationship' input:
  const { relationship, ...personInput } = args.person;
  const accountId = context.user.accountId;
  const userId = context.userId;

  const newPerson = _createPersonOnly(context, accountId, userId, personInput);
  if (newPerson) {
    // After new Person is created, attempt to create PersonRelationship record between Self Person and New Person.
    if (context.user.personId && relationship !== '') {
      const selfPerson = await getSelfPerson(context);
      const newPersonRelationship = await createPersonRelationship(context, selfPerson, newPerson, relationship);
      if (newPersonRelationship) {
        return newPerson;
      }
    } else {
      return newPerson;
    }
  }
  throw new Error('Failed to create new person');
}

export async function _createPersonOnly(context, accountId, userId, personInput) {
  // Convert date/time inputs from String to Date objects for schema DateTime columns.
  const birthDate = personInput.birthDate ? new Date(personInput.birthDate) : null;
  const deathDate = personInput.deathDate ? new Date(personInput.deathDate) : null;

  const newPerson = await context.prisma.person.create({
    data: {
      ...personInput,
      accountId: accountId,
      birthDate: birthDate,
      deathDate: deathDate,
      createdUserId: userId,
    },
  });
  if (newPerson) {
    const updatedPerson = await context.prisma.person.update({
      where: { id: newPerson.id },
      data: {
        externalId: 'Person' + newPerson.id,
      },
    });
    if (updatedPerson) {
      return updatedPerson;
    }
  }
  return null;
}

export async function updatePerson(parent, args, context) {
  const model = await getPerson(args.externalId, context);
  if (model) {
    // Construct input model with every property except 'relationship' input:
    const { relationship, ...personInput } = args.person;

    // Convert date/time inputs from String to Date objects for schema DateTime columns.
    const birthDate = personInput.birthDate ? new Date(personInput.birthDate) : null;
    const deathDate = personInput.deathDate ? new Date(personInput.deathDate) : null;

    const updatedPerson = await context.prisma.person.update({
      where: { id: model.id },
      data: {
        ...personInput,
        birthDate: birthDate,
        deathDate: deathDate,
      },
    });

    // After Person is updated, conditionally sync the PersonRelationship record between Self Person and New Person.
    // If PersonRelationship exists, but type is different than input relationship, logically-delete PR and recreate PR.
    if (context.user.personId) {
      const selfPerson = await getSelfPerson(context);
      const personRelationship = await getPersonRelationship(context, selfPerson, updatedPerson);
      if (!personRelationship) {
        await createPersonRelationship(context, selfPerson, updatedPerson, relationship);
      } else {
        if (personRelationship.type !== relationship) {
          const deletedRecord = await context.prisma.personRelationship.update({
            where: { id: personRelationship.id },
            data: {
              deleted: true,
              deletedAt: new Date(),
            },
          });
          if (deletedRecord) {
            await createPersonRelationship(context, selfPerson, updatedPerson, relationship);
          }
        }
      }
    }

    return updatedPerson;
  } else {
    throw new Error(`Failed to find Person by ID: ${args.externalId} to update`);
  }
}

export async function deletePerson(parent, args, context) {
  const selfPerson = await context.prisma.person.findFirst({
    where: { id: context.user.personId },
  });
  if (selfPerson.externalId === args.externalId) {
    throw new Error('Cannot delete Person for current user');
  }

  const model = await getPerson(args.externalId, context);
  if (model) {
    const deletedModel = await context.prisma.person.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find Person by ID: ${args.externalId} to delete`);
  }
}

async function getPerson(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.person.findFirst({
    where: {
      externalId: externalId,
      accountId: context.user.accountId,
      deleted: false,
    },
  });
  return model;
}

async function getSelfPerson(context) {
  const selfPerson = await context.prisma.person.findUnique({
    where: {
      id: context.user.personId,
      accountId: context.user.accountId,
    },
  });
  return selfPerson;
}

export async function createPersonRelationship(context, person1, person2, relationship) {
  const newPersonRelationship = await context.prisma.personRelationship.create({
    data: {
      person1Id: person1.id,
      person2Id: person2.id,
      type: relationship,
    },
  });
  return newPersonRelationship;
}

async function getPersonRelationship(context, person1, person2) {
  const personRelationship = await context.prisma.personRelationship.findFirst({
    where: {
      person1Id: person1.id,
      person2Id: person2.id,
      deleted: false,
    },
  });
  return personRelationship;
}
