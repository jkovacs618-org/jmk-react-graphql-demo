import { getEvent } from './Event.js'
import { getServiceAccount } from './ServiceAccount.js'

export async function createEventNote(parent, args, context) {
  const eventExternalId = args.eventExternalId;
  const noteInput = args.note;

  // Look up the Event record by externalId to get the event.id or null for Note.
  const event = (eventExternalId ? await getEvent(eventExternalId, context) : null);
  if (event) {
    return await _createNote(noteInput, 'Event', event.id, context);
  }
  else {
    throw new Error(
      `Failed to find Event by ID: ${eventExternalId} to create Note`
    );
  }
}

export async function createServiceNote(parent, args, context) {
  const serviceAccountExternalId = args.serviceAccountExternalId;
  const noteInput = args.note;

  // Look up the ServiceAccount record by externalId to get the event.id or null for Note.
  const serviceAccount = (serviceAccountExternalId ? await getServiceAccount(serviceAccountExternalId, context) : null);
  if (serviceAccount) {
    return await _createNote(noteInput, 'ServiceAccount', serviceAccount.id, context);
  }
  else {
    throw new Error(
      `Failed to find ServiceAccount by ID: ${serviceAccountExternalId} to create Note`
    );
  }
}

async function _createNote(noteInput, refType, refId, context) {
  const newNote = await context.prisma.note.create({
    data: {
      ...noteInput,
      accountId: context.user.accountId,
      refType: refType,
      refId: refId,
      eventId: (refType === 'Event' ? refId : null),
      serviceAccountId: (refType === 'ServiceAccount' ? refId : null),
      createdUserId: context.userId,
    }
  });

  if (newNote) {
    const note = await context.prisma.note.update({
      where: {id: newNote.id},
      data: {
        externalId: 'Note' + newNote.id
      }
    })
    return note;
  }
  return null;
}

export async function updateNote(parent, args, context) {
  const model = await getNote(args.externalId, context);
  if (model) {
    // Once a Note is set on an Event or ServiceAccount, it cannot be moved to another object/type.
    // Deconstruct any NoteInput fields that cannot be updated on Note:
    const {eventExternalId, serviceAccountExternalId, ...noteInput} = args.note;

    const updatedNote = await context.prisma.note.update({
      where: {id: model.id},
      data: noteInput,
    });

    return updatedNote;
  }
  else {
    throw new Error(
      `Failed to find Note by ID: ${args.externalId} to update`
    );
  }
}

export async function deleteNote(parent, args, context) {
  const model = await getNote(args.externalId, context);
  if (model) {
    const deletedModel = await context.prisma.note.update({
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
      `Failed to find Note by ID: ${args.externalId} to delete`
    );
  }
}

async function getNote(externalId, context) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await context.prisma.note.findFirst({
    where: {
      externalId: externalId,
      accountId: context.user.accountId,
      deleted: false,
    }
  });
  return model;
}
