export const typeDefs = `#graphql
  type Query {
    info: String!
    userInfo: String!

    accounts: [Account]
    account(
      externalId: String
    ): Account

    users: [User!]
    user(
      externalId: String
    ): User

    persons: [Person]
    person(
      externalId: String
    ): Person

    personsList(
      filter: String
      skip: Int
      take: Int
    ): PersonsList!

    calendars: [Calendar]
    calendar(
      externalId: String
    ): Calendar

    eventsList(
      filter: String
      skip: Int
      take: Int
    ): EventsList!

    events: [Event!]
    event(
      externalId: String
    ): Event

    organizations: [Organization]
    serviceTypes: [ServiceType]
    serviceAccounts: [ServiceAccount]
    serviceAccount(
      externalId: String
    ): ServiceAccount

    servicesList(
      filter: String
      skip: Int
      take: Int
    ): ServicesList!

    notes: [Note]
    note(
      externalId: String
    ): Note

    tags: [Tag]
    tag(
      externalId: String
    ): Tag

    serviceTags: [ServiceTag]
    serviceTag: ServiceTag
    eventTags: [EventTag]
    eventTag: EventTag
  }

  type PersonsList {
    id: ID!
    persons: [Person!]!
    count: Int!
  }

  type EventsList {
    id: ID!
    events: [Event!]!
    count: Int!
  }

  type ServicesList {
    id: ID!
    serviceAccounts: [ServiceAccount!]!
    count: Int!
  }

  type Mutation {
    signup(
      email: String!
      password: String!
      nameFirst: String!
      nameLast: String!
    ): AuthPayload

    login(email: String!, password: String!): AuthPayload

    createPerson(person: PersonInput!): Person!
    updatePerson(externalId: String!, person: PersonInput!): Person!
    deletePerson(externalId: String!): Person!

    createCalendar(calendar: CalendarInput!): Calendar!
    updateCalendar(externalId: String!, calendar: CalendarInput!): Calendar!
    deleteCalendar(externalId: String!): Calendar!

    createEvent(event: EventInput!): Event!
    updateEvent(externalId: String!, event: EventInput!): Event!
    deleteEvent(externalId: String!): Event!

    createServiceAccount(serviceAccount: ServiceAccountInput!): ServiceAccount!
    updateServiceAccount(externalId: String!, serviceAccount: ServiceAccountInput!): ServiceAccount!
    deleteServiceAccount(externalId: String!): ServiceAccount!

    createEventNote(eventExternalId: ID!, note: NoteInput!): Note!
    createServiceNote(serviceAccountExternalId: ID!, note: NoteInput!): Note!
    updateNote(externalId: String!, note: NoteInput!): Note!
    deleteNote(externalId: String!): Note!

    createEventTag(eventTag: EventTagInput!): Tag!
    createServiceTag(serviceTag: ServiceTagInput!): Tag!
    deleteEventTag(eventExternalId: ID!, tagExternalId: ID!): Boolean
    deleteServiceTag(serviceAccountExternalId: ID!, tagExternalId: ID!): Boolean
  }

  type AuthPayload {
    token: String
    user: User
    personExternalId: String
  }

  enum Sort {
    asc
    desc
  }

  scalar DateTime

  type Account {
    id: ID!
    externalId: String!
    accountNumber: String
    accountType: String
    status: String
    createdAt: DateTime
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    users: [User!]!
    persons: [Person!]!
    events: [Event!]!
    serviceAccounts: [ServiceAccount!]!
    notes: [Note!]!
    tags: [Tag!]!
  }

  type User {
    id: ID!
    externalId: String!
    accountId: ID!
    account: Account!
    nameFirst: String!
    nameLast: String!
    email: String!
    status: String
    createdUserId: Int
    createdUser: User
    createdAt: DateTime
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    person: Person
  }

  type Person {
    id: ID!
    externalId: String
    accountId: ID!
    account: Account!
    userId: ID
    user: User
    nameFirst: String!
    nameMiddle: String
    nameLast: String!
    suffix: String
    gender: String
    maritalStatus: String
    birthDate: DateTime
    deathDate: DateTime
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    person1Relationship: PersonRelationship
    person2Relationship: PersonRelationship
  }

  type PersonRelationship {
    id: ID!
    accountId: ID!
    account: Account!
    person1Id: ID!
    person2Id: ID!
    type: String!
    otherType: String
    createdAt: DateTime
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    person1: Person
    person2: Person
  }

  type PersonGroup {
    id: ID!
    externalId: String
    accountId: ID!
    account: Account!
    name: String!
    type: String!
    subType: String
    otherType: String
    otherSubType: String
    createdAt: DateTime
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    # persons: [Person]
  }

  type Calendar {
    id: ID!
    externalId: String
    accountId: ID!
    account: Account!
    title: String!
    status: String
    isDefault: Boolean
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    events: [Event]
  }

  type Event {
    id: ID!
    externalId: String
    accountId: ID!
    account: Account!
    calendarId: ID
    calendar: Calendar
    title: String!
    location: String
    startDate: DateTime
    endDate: DateTime
    notes: [Note]
    tags: [Tag]
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
  }

  type Organization {
    id: ID!
    externalId: String
    name: String!
    type: String
    industry: String
    website: String
    status: String
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
  }

  type ServiceType {
    id: ID!
    externalId: String
    name: String!
    status: String
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
  }

  type ServiceAccount {
    id: ID!
    externalId: String
    accountId: ID!
    account: Account!
    organizationId: ID
    organization: Organization
    serviceTypeId: ID
    serviceType: ServiceType
    description: String
    accountNumber: String
    status: String
    startDate: DateTime
    endDate: DateTime
    website: String
    email: String
    username: String
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    notes: [Note]
    tags: [Tag]
    serviceTags: [ServiceTag]
  }

  type Note {
    id: ID!
    externalId: String
    accountId: ID!
    account: Account!
    refType: String
    refId: ID
    serviceAccountId: ID
    serviceAccount: ServiceAccount
    eventId: ID
    event: Event
    title: String
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    contents: String
  }

  type Tag {
    id: ID!
    externalId: String
    accountId: ID!
    account: Account!
    title: String
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    updatedAt: DateTime
    deleted: Int
    deletedAt: DateTime
    eventTags: [EventTag]
    serviceTags: [ServiceTag]
  }

  type EventTag {
    id: ID!
    eventId: ID
    event: Event
    tagId: ID
    tag: Tag
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    deleted: Int
    deletedAt: DateTime
  }

  type ServiceTag {
    id: ID!
    serviceAccountId: ID
    serviceAccount: ServiceAccount
    tagId: ID
    tag: Tag
    createdAt: DateTime
    createdUserId: Int
    createdUser: User
    deleted: Int
    deletedAt: DateTime
  }

  # Inputs:

  input PersonInput {
    nameFirst: String!
    nameMiddle: String
    nameLast: String!
    gender: String
    birthDate: String
    deathDate: String
    maritalStatus: String
    relationship: String
  }

  input CalendarInput {
    title: String!
    isDefault: Boolean
  }

  input EventInput {
    calendarExternalId: String!
    title: String!
    location: String
    startDate: DateTime
    endDate: DateTime
    newCalendarTitle: String
  }

  input ServiceAccountInput {
    organizationExternalId: String!
    serviceTypeExternalId: String!
    description: String
    accountNumber: String
    status: String
    startDate: DateTime
    endDate: DateTime
    website: String
    email: String
    username: String
    newOrganizationName: String
  }

  input NoteInput {
    title: String!
    contents: String!
  }

  input EventTagInput {
    eventExternalId: String!
    title: String!
  }

  input ServiceTagInput {
    serviceAccountExternalId: String!
    title: String!
  }

  enum Sort {
    asc
    desc
  }

`