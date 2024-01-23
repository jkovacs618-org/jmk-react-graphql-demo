import { getEvent } from './Event.js'
import { getServiceAccount } from './ServiceAccount.js'

export async function createEventTag(parent, args, context) {
  const { eventExternalId, ...tagInput } = args.eventTag;

  // Look up the Event record by externalId to get the event.id or null for Tag.
  const event = (eventExternalId ? await getEvent(eventExternalId, context) : null);
  if (event) {
    const tag = await _getOrCreateTag(tagInput, context);
    if (tag) {
      // After the new Tag is found or created, then create the EventTag record, if not exists for Event+Tag.
      const eventTag = await context.prisma.eventTag.findFirst({
        where: {eventId: event.id, tagId: tag.id, deleted: false}
      });
      if (!eventTag) {
        const newEventTag = await context.prisma.eventTag.create({
          data: {
            eventId: event.id,
            tagId: tag.id,
            createdUserId: context.user.id,
          }
        })
      }

      // Return Tag instead of EventTag (mapping), since createEventTag signature is for return Tag.
      return tag;
    }
    else {
      throw new Error(
        `Failed to find or create Tag for Event`
      );
    }
  }
  else {
    throw new Error(
      `Failed to find Event by ID: ${eventExternalId} to create Tag`
    );
  }
}

export async function createServiceTag(parent, args, context) {
  const {serviceAccountExternalId, ...tagInput} = args.serviceTag;

  // Look up the ServiceAccount record by externalId to get the event.id or null for Tag.
  const serviceAccount = (serviceAccountExternalId ? await getServiceAccount(serviceAccountExternalId, context) : null);
  if (serviceAccount) {
    const tag = await _getOrCreateTag(tagInput, context);
    if (tag) {
      // After the new Tag is found or created, then create the ServiceTag record, if not exists for Service+Tag.
      const serviceTag = await context.prisma.serviceTag.findFirst({
        where: {serviceAccountId: serviceAccount.id, tagId: tag.id, deleted: false}
      });
      if (!serviceTag) {
        const newServiceTag = await context.prisma.serviceTag.create({
          data: {
            serviceAccountId: serviceAccount.id,
            tagId: tag.id,
            createdUserId: context.user.id,
          }
        })
      }

      // Return Tag instead of ServiceTag (mapping), since createServiceTag signature is for return Tag.
      return tag;
    }
    else {
      throw new Error(
        `Failed to find or create Tag for Service`
      );
    }
  }
  else {
    throw new Error(
      `Failed to find ServiceAccount by ID: ${serviceAccountExternalId} to create Tag`
    );
  }
}

async function _getOrCreateTag(tagInput, context) {
  // First, check if a Tag exists for this account by 'title' to re-use it.
  const tag = await getTagByTitle(tagInput.title, context);
  if (tag) {
    return tag;
  }
  else {
    const newTag = await context.prisma.tag.create({
      data: {
        ...tagInput,
        accountId: context.user.accountId,
        createdUserId: context.userId,
      }
    });
    if (newTag) {
      const tag = await context.prisma.tag.update({
        where: {id: newTag.id},
        data: {
          externalId: 'Tag' + newTag.id
        }
      })
      return tag;
    }
  }
  return null;
}

export async function deleteEventTag(parent, args, context) {
  const tag = await getTag(args.tagExternalId, context);
  if (tag) {
    const event = await getEvent(args.externalEventId, context);
    if (event) {
      const { count } = await context.prisma.eventTag.updateMany({
        where: {eventId: event.id, tagId: tag.id, deleted: false},
        data: {
          deleted: true,
          deletedAt: new Date(),
        }
      });
      return (count > 0);
    }
    else {
      throw new Error(
        `Failed to find Event by ID: ${args.externalEventId} to delete tag`
      );
    }
  }
  else {
    throw new Error(
      `Failed to find Tag by ID: ${args.tagExternalId} to delete tag`
    );
  }
}

export async function deleteServiceTag(parent, args, context) {
  const tag = await getTag(args.tagExternalId, context);
  if (tag) {
    const serviceAccount = await getService(args.externalServiceAccountId, context);
    if (serviceAccount) {
      const { count } = await context.prisma.serviceTag.updateMany({
        where: {serviceAccountId: serviceAccount.id, tagId: tag.id, deleted: false},
        data: {
          deleted: true,
          deletedAt: new Date(),
        }
      });
      return (count > 0);
    }
    else {
      throw new Error(
        `Failed to find Service by ID: ${args.externalServiceAccountId} to delete tag`
      );
    }
  }
  else {
    throw new Error(
      `Failed to find Tag by ID: ${args.tagExternalId} to delete tag`
    );
  }
}

async function getTag(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.tag.findFirst({
    where: {
      externalId: externalId,
      accountId: context.user.accountId,
      deleted: false,
    }
  });
  return model;
}

async function getTagByTitle(title, context) {
  const model = await context.prisma.tag.findFirst({
    where: {
      title: title,
      accountId: context.user.accountId,
      deleted: false,
    }
  });
  return model;
}
