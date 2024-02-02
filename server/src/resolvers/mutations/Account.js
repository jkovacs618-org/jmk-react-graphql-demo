import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../utils/auth.js';
import { _createPersonOnly, createPersonRelationship } from './Person.js';

export async function signup(parent, args, context) {
  const newAccount = await context.prisma.account.create({
    data: {
      status: 'Active',
      accountType: 'Customer',
    },
  });
  if (newAccount) {
    const updatedAccount = await context.prisma.account.update({
      where: { id: newAccount.id },
      data: {
        externalId: 'Account' + newAccount.id,
      },
    });
    if (updatedAccount) {
      const user = await createUser(args, context, newAccount);
      if (user) {
        const person = await context.prisma.person.findFirst({
          where: { id: user.personId },
        });
        if (person) {
          const token = jwt.sign({ userId: user.id }, APP_SECRET);
          return {
            token,
            user,
            personExternalId: person.externalId,
          };
        }
      }
    }
  }
  throw new Error('Failed to create new account');
}

async function createUser(args, context, newAccount) {
  const password = await bcrypt.hash(args.password, 10);
  const newUser = await context.prisma.user.create({
    data: { ...args, password, accountId: newAccount.id },
  });
  if (newUser) {
    const newUserUpdated = await context.prisma.user.update({
      where: { id: newUser.id },
      data: {
        externalId: 'User' + newUser.id,
        createdUserId: newUser.id,
      },
    });
    if (newUserUpdated) {
      // Create the initial Person record for this new User and set to 'Self'.
      const personInput = {
        nameFirst: newUser.nameFirst,
        nameLast: newUser.nameLast,
        accountId: newAccount.id,
      };

      const newPerson = await _createPersonOnly(context, newAccount.id, newUser.id, personInput);
      if (newPerson) {
        // After the Person is created, assign it to this new User.personId.
        const updatedUser = await context.prisma.user.update({
          where: { id: newUser.id },
          data: {
            personId: newPerson.id,
          },
        });
        if (updatedUser) {
          // Create the PersonRelationship record of 'Self' for this Person with local values, since context.user is not set.
          const newPersonRelationship = await createPersonRelationship(context, newPerson, newPerson, 'Self');
          if (newPersonRelationship) {
            // Create the Default Calendar for this new Account with local values, since context.user is not set.
            const newCalendar = await _createCalendar('Default', context, newAccount.id, updatedUser.id);
            if (newCalendar) {
              return updatedUser;
            }
          }
        }
      }
    }
  }
  throw new Error('Failed to create new user');
}

export async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error('Invalid email address');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const person = await context.prisma.person.findFirst({
    where: { id: user.personId },
  });
  if (!person) {
    throw new Error('Invalid user record');
  }

  user.person = person;

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
    personExternalId: person.externalId,
  };
}

async function _createCalendar(newCalendarTitle, context, accountId, userId) {
  const newCalendar = await context.prisma.calendar.create({
    data: {
      accountId: accountId,
      title: newCalendarTitle,
      isDefault: true,
      createdUserId: userId,
    },
  });
  if (newCalendar) {
    const calendar = await context.prisma.calendar.update({
      where: { id: newCalendar.id },
      data: {
        externalId: 'Calendar' + newCalendar.id,
      },
    });
    return calendar;
  }
  return null;
}
