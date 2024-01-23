
export async function createPerson(parent, args, context) {
  // Construct input model with every property except 'relationship' input:
  const {relationship, ...personInput} = args.person;

  // Convert date/time inputs from String to Date objects for schema DateTime columns.
  const birthDate = (personInput.birthDate ? new Date(personInput.birthDate) : null);
  const deathDate = (personInput.deathDate ? new Date(personInput.deathDate) : null);

  const newPerson = await context.prisma.person.create({
    data: {
      ...personInput,
      accountId: context.user.accountId,
      birthDate: birthDate,
      deathDate: deathDate,
      createdUserId: context.userId,
    }
  });

  const person = await context.prisma.person.update({
    where: {id: newPerson.id},
    data: {
      externalId: 'Person' + newPerson.id
    }
  })

  // After new Person is created, attempt to create PersonRelationship record between Self Person and New Person.
  if (context.user.personId && relationship !== '') {
    const selfPerson = await getSelfPerson(context);
    const newPersonRelationship = await createPersonRelationship(context, selfPerson, newPerson, relationship)
  }

  return person;
}

export async function updatePerson(parent, args, context) {
  const model = await getPerson(args.externalId, context);
  if (model) {
    // Construct input model with every property except 'relationship' input:
    const {relationship, ...personInput} = args.person;

    // Convert date/time inputs from String to Date objects for schema DateTime columns.
    const birthDate = (personInput.birthDate ? new Date(personInput.birthDate) : null);
    const deathDate = (personInput.deathDate ? new Date(personInput.deathDate) : null);

    const updatedPerson = await context.prisma.person.update({
      where: {id: model.id},
      data: {
        ...personInput,
        birthDate: birthDate,
        deathDate: deathDate,
      }
    });

    // After Person is updated, sync the PersonRelationship record between Self Person and New Person.
    // If PersonRelationship exists, but type is different than input relationship, logically-delete PR and recreate PR.
    if (context.user.personId) {
      const selfPerson = await getSelfPerson(context);
      const personRelationship = await getPersonRelationship(context, selfPerson, updatedPerson);
      if (!personRelationship) {
        const newPersonRelationship = await createPersonRelationship(context, selfPerson, updatedPerson, relationship)
      }
      else {
        if (personRelationship.type !== relationship) {
          const deletedRecord = await context.prisma.personRelationship.update({
            where: {id: personRelationship.id},
            data: {
              deleted: true,
              deletedAt: new Date(),
            }
          })
          if (deletedRecord) {
            const newPersonRelationship = await createPersonRelationship(context, selfPerson, updatedPerson, relationship)
          }
        }
      }
    }

    return updatedPerson;
  }
  else {
    throw new Error(
      `Failed to find Person by ID: ${args.externalId} to update`
    );
  }
}

export async function deletePerson(parent, args, context) {
  const model = await getPerson(args.externalId, context);
  if (model) {
    const deletedModel = await context.prisma.person.update({
      where: {id: model.id},
      data: {
        deleted: true,
        deletedAt: new Date(),
      }
    });
    return deletedModel;
  }
  else {
    throw new Error(
      `Failed to find Person by ID: ${args.externalId} to delete`
    );
  }
}

async function getPerson(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.person.findFirst({
    where: {
      externalId: externalId,
      accountId: context.user.accountId,
      deleted: false,
    }
  });
  return model;
}

async function getSelfPerson(context) {
  const selfPerson = await context.prisma.person.findUnique({
    where: {
      id: context.user.personId,
      accountId: context.user.accountId,
    }
  });
  return selfPerson;
}

async function createPersonRelationship(context, person1, person2, relationship) {
  const newPersonRelationship = await context.prisma.personRelationship.create({
    data: {
      person1Id: person1.id,
      person2Id: person2.id,
      type: relationship,
    }
  });
  return newPersonRelationship;
}

async function getPersonRelationship(context, person1, person2) {
  const personRelationship = await context.prisma.personRelationship.findFirst({
    where: {
      person1Id: person1.id,
      person2Id: person2.id,
      deleted: false,
    }
  })
  return personRelationship;
}