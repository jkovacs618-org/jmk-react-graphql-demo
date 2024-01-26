import { login, signup } from './Account.js';
import { createPerson, updatePerson, deletePerson } from './Person.js';
import { createCalendar, updateCalendar, deleteCalendar } from './Calendar.js';
import { createEvent, updateEvent, deleteEvent } from './Event.js';
import { createServiceAccount, updateServiceAccount, deleteServiceAccount } from './ServiceAccount.js';
import { createServiceNote, createEventNote, updateNote, deleteNote } from './Note.js';
import { createServiceTag, createEventTag, deleteEventTag, deleteServiceTag } from './Tag.js';

export const Mutation = {
  signup,
  login,
  createPerson,
  updatePerson,
  deletePerson,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  createEvent,
  updateEvent,
  deleteEvent,
  createServiceAccount,
  updateServiceAccount,
  deleteServiceAccount,
  createServiceNote,
  createEventNote,
  updateNote,
  deleteNote,
  createServiceTag,
  createEventTag,
  deleteEventTag,
  deleteServiceTag,
};
