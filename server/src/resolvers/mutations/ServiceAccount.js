
export async function createServiceAccount(parent, args, context) {
  // Construct input model with every property except specific input fields not on ServiceAccount:
  const {organizationExternalId, serviceTypeExternalId, newOrganizationName, ...serviceAccountInput} = args.serviceAccount;

  // Convert date/time inputs from String to Date objects for schema DateTime columns.
  const startDate = (serviceAccountInput.startDate ? new Date(serviceAccountInput.startDate) : null);
  const endDate = (serviceAccountInput.endDate ? new Date(serviceAccountInput.endDate) : null);

  // Look up the Organization record by externalId to get the organization.id or null for ServiceAccount.
  // Create a new Organization for this Account if the organizationExternalId value is 'NEW' and newOrganizationName is set.
  let organizationId = null;
  if (organizationExternalId === 'NEW') {
    if (newOrganizationName !== '') {
      const organization = await createOrganization(newOrganizationName, context);
      organizationId = (organization ? organization.id : null);
    }
  }
  else {
    const organization = await getOrganization(organizationExternalId, context);
    organizationId = (organization ? organization.id : null);
  }

  // Look up the ServiceType record by externalId to get the serviceType.id or null for ServiceAccount.
  const serviceType = await getServiceType(serviceTypeExternalId, context);
  const serviceTypeId = (serviceType ? serviceType.id : null);

  const newServiceAccount = await context.prisma.serviceAccount.create({
    data: {
      ...serviceAccountInput,
      accountId: context.user.accountId,
      organizationId: organizationId,
      serviceTypeId: serviceTypeId,
      startDate: startDate,
      endDate: endDate,
      createdUserId: context.userId,
    }
  });

  if (newServiceAccount) {
    const serviceAccount = await context.prisma.serviceAccount.update({
      where: {id: newServiceAccount.id},
      data: {
        externalId: 'ServiceAccount' + newServiceAccount.id
      }
    });
    return serviceAccount;
  }
  return null;
}

export async function updateServiceAccount(parent, args, context) {
  const model = await getServiceAccount(args.externalId, context);
  if (model) {
    // Construct input model with every property except specific input fields not on ServiceAccount:
    const {organizationExternalId, serviceTypeExternalId, newOrganizationName, ...serviceAccountInput} = args.serviceAccount;

    // Convert date/time inputs from String to Date objects for schema DateTime columns.
    const startDate = (serviceAccountInput.startDate ? new Date(serviceAccountInput.startDate) : null);
    const endDate = (serviceAccountInput.endDate ? new Date(serviceAccountInput.endDate) : null);

    // Look up the Organization record by externalId to get the organization.id or null for ServiceAccount.
    // Create a new Organization for this Account if the organizationExternalId value is 'NEW' and newOrganizationName is set.
    let organizationId = null;
    if (organizationExternalId === 'NEW') {
      if (newOrganizationName !== '') {
        const organization = await createOrganization(newOrganizationName, context);
        organizationId = (organization ? organization.id : null);
      }
    }
    else {
      const organization = await getOrganization(organizationExternalId, context);
      organizationId = (organization ? organization.id : null);
    }

    // Look up the ServiceType record by externalId to get the serviceType.id or null for ServiceAccount.
    const serviceType = await getServiceType(serviceTypeExternalId, context);
    const serviceTypeId = (serviceType ? serviceType.id : null);

    const updatedServiceAccount = await context.prisma.serviceAccount.update({
      where: {id: model.id},
      data: {
        ...serviceAccountInput,
        organizationId: organizationId,
        serviceTypeId: serviceTypeId,
        startDate: startDate,
        endDate: endDate,
      }
    });

    return updatedServiceAccount;
  }
  else {
    throw new Error(
      `Failed to find ServiceAccount by ID: ${args.externalId} to update`
    );
  }
}

export async function deleteServiceAccount(parent, args, context) {
  const model = await getServiceAccount(args.externalId, context);
  if (model) {
    const deletedModel = await context.prisma.serviceAccount.update({
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
      `Failed to find ServiceAccount by ID: ${args.externalId} to delete`
    );
  }
}

export async function getServiceAccount(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.serviceAccount.findFirst({
    where: {
      externalId: externalId,
      accountId: context.user.accountId,
      deleted: false,
    }
  });
  return model;
}

async function getOrganization(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.organization.findFirst({
    where: {
      AND: [
        { externalId: externalId },
        { deleted: false },
        {
          OR: [
            { accountId: 1},
            { accountId: context.user.accountId },
          ]
        }
      ],
    }
  });
  return model;
}

async function getServiceType(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.serviceType.findFirst({
    where: {
      AND: [
        { externalId: externalId },
        { deleted: false },
        {
          OR: [
            { accountId: 1},
            { accountId: context.user.accountId },
          ]
        }
      ],
    }
  });
  return model;
}

async function createOrganization(newOrganizationName, context) {
  const newOrganization = await context.prisma.organization.create({
    data: {
      accountId: context.user.accountId,
      name: newOrganizationName,
      createdUserId: context.userId,
    }
  });
  if (newOrganization) {
    const organization = await context.prisma.organization.update({
      where: {id: newOrganization.id},
      data: {
        externalId: 'Organization' + newOrganization.id
      }
    });
    return organization;
  }
  return null;
}