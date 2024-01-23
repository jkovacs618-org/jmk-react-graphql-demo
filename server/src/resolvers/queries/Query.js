import { userInfo, accounts, users } from './Accounts.js';
import { persons, personsList, person } from './Persons.js';
import { calendars } from './Calendars.js';
import { eventsList, events, event } from './Events.js';
import { organizations, serviceTypes, serviceAccounts, serviceAccount, servicesList } from './Services.js';
import { notes } from './Notes.js';
import { tags } from './Tags.js';

function info(parent, args, context, info) {
  return 'GraphQL Server (Apollo + Prisma)';
}

export const Query = {
  info,
  userInfo,
  accounts,
  users,
  persons,
  personsList,
  person,
  calendars,
  events,
  eventsList,
  event,
  organizations,
  serviceTypes,
  serviceAccounts,
  serviceAccount,
  servicesList,
  notes,
  tags,
};
