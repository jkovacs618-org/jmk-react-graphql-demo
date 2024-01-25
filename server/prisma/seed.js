// Prisma Seed Database script
// See: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
//
// Seeding runs automatically on:
// $ npx prisma migrate dev
// and
// $ npx prisma migrate reset
//
// NOTE: To run migrate dev|reset above without seeding, add --skip-seed flag.
//
// Manual Usage:
// $ npx prisma db seed

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

  // Accounts:
  const accounts = [
    {id: 1, externalId: 'Account1', accountNumber: '1000001', accountType: 'System'},
    {id: 2, externalId: 'Account2', accountNumber: '1000002', accountType: 'Customer'},
  ];
  for (let i = 0; i < accounts.length; i++) {
    const accountData = accounts[i];
    await prisma.account.upsert({
      where: { id: accountData.id },
      update: {},
      create: accountData,
    });
  }
  console.log('Created ' + accounts.length + ' Account records.');

  // Users:
  const users = [
    {
      externalId: 'User1', accountId: 1, nameFirst: 'Admin', nameLast: 'User',
      email: 'admin@example.org', password: '$2a$10$KFh4/AIAZvfbMeXHk.wA4Op1Pa5N9DVoIYVtsR5p4Wbty6ftRTMXC', // "password"
    },
    {
      externalId: 'User2', accountId: 2, nameFirst: 'Demo', nameLast: 'Name',
      // NOTE: This email address of user@example.org matches the React app .env file VITE_DEFAULT_EMAIL/PASSWORD to shortcut login.
      email: 'user@example.org', password: '$2a$10$KFh4/AIAZvfbMeXHk.wA4Op1Pa5N9DVoIYVtsR5p4Wbty6ftRTMXC', // "password"
    },
    {
      externalId: 'User3', accountId: 2, nameFirst: 'Spouse', nameLast: 'Name',
      email: 'spouse@example.org', password: '$2a$10$KFh4/AIAZvfbMeXHk.wA4Op1Pa5N9DVoIYVtsR5p4Wbty6ftRTMXC', // "password"
    }
  ];
  for (let i = 0; i < users.length; i++) {
    const userData = users[i];
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }
  console.log('Created ' + users.length + ' User records.');

  // NOTE: prisma.model.createMany is not supported by SQLite, so use loop of await prisma.model.create statements.
  // Ref: https://www.prisma.io/docs/orm/reference/prisma-client-reference#remarks-10

  // Persons:
  const persons = [
    {externalId: 'Person1', accountId: 2, nameFirst: 'Demo', nameLast: 'Name', gender: 'Male', birthDate: new Date('1980-01-01 12:00:00')},
    {externalId: 'Person2', accountId: 2, nameFirst: 'Spouse', nameLast: 'Name', gender: 'Female', birthDate: new Date('1981-07-01 12:00:00')},
    {externalId: 'Person3', accountId: 2, nameFirst: 'Child 1', nameLast: 'Name', gender: 'Male', birthDate: new Date('2014-06-01 12:00:00')},
    {externalId: 'Person4', accountId: 2, nameFirst: 'Child 2', nameLast: 'Name', gender: 'Female', birthDate: new Date('2016-02-01 12:00:00')},
  ];
  for (let i = 0; i < persons.length; i++) {
    await prisma.person.create({data: persons[i]});
  }
  console.log('Created ' + persons.length + ' Person records.');

  // PersonRelationships:
  const personRelationships = [
    {person1Id: 1, person2Id: 1, type: 'Self'},
    {person1Id: 1, person2Id: 2, type: 'Spouse'},
    {person1Id: 1, person2Id: 3, type: 'Child'},
    {person1Id: 1, person2Id: 4, type: 'Child'},
  ];
  for (let i = 0; i < personRelationships.length; i++) {
    await prisma.personRelationship.create({data: personRelationships[i]});
  }
  console.log('Created ' + personRelationships.length + ' PersonRelationship records.');

  // User Person Updates:
  const updatedUser2 = await prisma.user.update({
    where: {id: 2},
    data: {personId: 1}
  });
  const updatedUser3 = await prisma.user.update({
    where: {id: 3},
    data: {personId: 2}
  });
  if (updatedUser2 && updatedUser3) {
    console.log('Updated 2 User records to set Person ID.');
  }

  // Calendars:
  const calendars = [
    {externalId: 'Calendar1', accountId: 2, title: 'Default', isDefault: true},
    {externalId: 'Calendar2', accountId: 2, title: 'Sports', isDefault: false},
  ];
  for (let i = 0; i < calendars.length; i++) {
    await prisma.calendar.create({data: calendars[i]});
  }
  console.log('Created ' + calendars.length + ' Calendar records.');

  // Events:
  const events = [
    {externalId: 'Event1', accountId: 2, calendarId: 1, title: 'Dentist Appointment', location: 'Dentist Office', startDate: new Date('2024-04-01 12:00:00'), endDate: new Date('2024-04-01 14:00:00')},
    {externalId: 'Event2', accountId: 2, calendarId: 1, title: 'Kid\'s Birthday Party', location: 'Skating Rink', startDate: new Date('2024-02-03 17:00:00'), endDate: new Date('2024-02-03 18:00:00')},
    {externalId: 'Event3', accountId: 2, calendarId: 2, title: 'Kid\'s Soccer Game', location: 'School Field', startDate: new Date('2024-03-02 10:00:00'), endDate: new Date('2024-03-02 12:00:00')},
  ];
  for (let i = 0; i < events.length; i++) {
    await prisma.event.create({data: events[i]});
  }
  console.log('Created ' + events.length + ' Event records.');

  // Organizations:
  const organizations = [
    {externalId: 'Organization1', accountId: 1, name: 'Electric Company Inc', type: 'Utility'},
    {externalId: 'Organization2', accountId: 1, name: 'Cable Company Inc', type: 'Telecom'},
    {externalId: 'Organization3', accountId: 1, name: 'Gas Company Inc', type: 'Utility'},
  ];
  for (let i = 0; i < organizations.length; i++) {
    await prisma.organization.create({data: organizations[i]});
  }
  console.log('Created ' + organizations.length + ' Organization records.');

  // ServiceTypes:
  const serviceTypes = [
    {externalId: 'ServiceType1', accountId: 1, name: 'Generic'},
    {externalId: 'ServiceType2', accountId: 1, name: 'Utility'},
    {externalId: 'ServiceType3', accountId: 1, name: 'Telecom'},
    {externalId: 'ServiceType4', accountId: 1, name: 'Government'},
    {externalId: 'ServiceType5', accountId: 1, name: 'Financial'},
    {externalId: 'ServiceType6', accountId: 1, name: 'Insurance'},
    {externalId: 'ServiceType7', accountId: 1, name: 'Medical'},
    {externalId: 'ServiceType8', accountId: 1, name: 'Retailer'},
    {externalId: 'ServiceType9', accountId: 1, name: 'Online Service'},
    {externalId: 'ServiceType10', accountId: 1, name: 'Other'},
  ];
  for (let i = 0; i < serviceTypes.length; i++) {
    await prisma.serviceType.create({data: serviceTypes[i]});
  }
  console.log('Created ' + serviceTypes.length + ' ServiceType records.');

  // ServiceAccounts:
  const serviceAccounts = [
    {
      externalId: 'ServiceAccount1',
      accountId: 2,
      organizationId: 1,
      serviceTypeId: 2,
      description: 'Electric/Water',
      status: 'Active',
      accountNumber: '123456789',
      username: 'myuser',
      startDate: new Date('2019-01-01 12:00:00'),
      endDate: null,
    },
    {
      externalId: 'ServiceAccount2',
      accountId: 2,
      organizationId: 2,
      serviceTypeId: 3,
      description: 'Cable/Internet',
      status: 'Active',
      accountNumber: '234567890',
      username: 'myuser',
      startDate: new Date('2019-01-01 12:00:00'),
      endDate: null,
    },
    {
      externalId: 'ServiceAccount3',
      accountId: 2,
      organizationId: 3,
      serviceTypeId: 2,
      description: 'Natural Gas',
      status: 'Active',
      accountNumber: '100012345',
      username: 'myuser',
      startDate: new Date('2019-01-01 12:00:00'),
      endDate: null,
    },
  ];
  for (let i = 0; i < serviceAccounts.length; i++) {
    await prisma.serviceAccount.create({data: serviceAccounts[i]});
  }
  console.log('Created ' + serviceAccounts.length + ' ServiceAccount records.');

  // Notes:
  const notes = [
    {
      externalId: 'Note1',
      accountId: 2,
      createdUserId: 2,
      refType: 'ServiceAccount',
      refId: 1,
      serviceAccountId: 1,
      title: 'Service Note 1',
      contents: 'Note Contents 1'
    },
    {
      externalId: 'Note2',
      accountId: 2,
      createdUserId: 2,
      refType: 'ServiceAccount',
      refId: 2,
      serviceAccountId: 2,
      title: 'Service Note 2',
      contents: 'Note Contents 2'
    },
    {
      externalId: 'Note3',
      accountId: 2,
      createdUserId: 2,
      refType: 'Event',
      refId: 1,
      eventId: 1,
      title: 'Event Note 1',
      contents: 'Note Contents 3'
    },
  ];
  for (let i = 0; i < notes.length; i++) {
    await prisma.note.create({data: notes[i]});
  }
  console.log('Created ' + notes.length + ' Note records.');

  // Tags:
  const tags = [
    {
      externalId: 'Tag1',
      accountId: 2,
      title: 'Important',
      createdUserId: 2,
    },
    {
      externalId: 'Tag2',
      accountId: 2,
      title: 'Kids',
      createdUserId: 2,
    },
    {
      externalId: 'Tag3',
      accountId: 2,
      title: 'Other Tag',
      createdUserId: 2,
      deleted: true,
      deletedAt: new Date(),
    },
  ];
  for (let i = 0; i < tags.length; i++) {
    await prisma.tag.create({data: tags[i]});
  }
  console.log('Created ' + tags.length + ' Tag records.');

  // ServiceTags:
  const serviceTags = [
    {serviceAccountId: 1, tagId: 1, createdUserId: 2},
    {serviceAccountId: 2, tagId: 2, createdUserId: 2},
    {serviceAccountId: 2, tagId: 3, createdUserId: 2, deleted: true, deletedAt: new Date()},
  ];
  for (let i = 0; i < serviceTags.length; i++) {
    await prisma.serviceTag.create({data: serviceTags[i]});
  }
  console.log('Created ' + serviceTags.length + ' ServiceTag records.');

  // EventTags:
  const eventTags = [
    {eventId: 1, tagId: 1, createdUserId: 2},
    {eventId: 2, tagId: 2, createdUserId: 2},
    {eventId: 3, tagId: 2, createdUserId: 2},
  ];
  for (let i = 0; i < eventTags.length; i++) {
    await prisma.eventTag.create({data: eventTags[i]});
  }
  console.log('Created ' + eventTags.length + ' EventTag records.');

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
