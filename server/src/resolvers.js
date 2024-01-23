import { Query } from './resolvers/queries/Query.js';
import { Mutation } from './resolvers/mutations/Mutation.js';
import { Account } from './resolvers/Account.js';
import { Person } from './resolvers/Person.js';
import { Event } from './resolvers/Event.js';
import { ServiceAccount } from './resolvers/ServiceAccount.js';

export const resolvers = {
  Query: Query,
  Mutation: Mutation,
  Account: Account,
  Person: Person,
  Event: Event,
  ServiceAccount: ServiceAccount,
};
