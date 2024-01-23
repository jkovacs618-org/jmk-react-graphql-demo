import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../utils/auth.js';

export async function signup(parent, args, context, info) {
  const newAccount = await context.prisma.account.create({
    data: {
      status: 'Active',
      accountType: 'Customer',
    }
  })
  if (newAccount) {
    const updatedAccount = await context.prisma.account.update({
      where: {id: newAccount.id},
      data: {
        externalId: 'Account' + newAccount.id,
      }
    })

    const password = await bcrypt.hash(args.password, 10);
    const accountId = newAccount.id;

    const user = await context.prisma.user.create({
      data: { ...args, password, accountId }
    });
    if (user) {
      const updatedUser = await context.prisma.user.update({
        where: {id: user.id},
        data: {
          externalId: 'User' + user.id,
          createdUserId: user.id,
        }
      })

      // Create the Default Calendar for this new Account:
      const calendar = await createCalendar('Default', context, newAccount.id, user.id);

      const token = jwt.sign({ userId: user.id }, APP_SECRET);
      return {
        token,
        user
      };
    }
    else {
      throw new Error('Failed to create new user');
    }
  }
  else {
    throw new Error('Failed to create new account');
  }
}

export async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });
  if (!user) {
    throw new Error('Invalid email address');
  }

  const valid = await bcrypt.compare(
    args.password,
    user.password
  );
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function createCalendar(newCalendarTitle, context, accountId, userId) {
  const newCalendar = await context.prisma.calendar.create({
    data: {
      accountId: accountId,
      title: newCalendarTitle,
      isDefault: true,
      createdUserId: userId,
    }
  })
  if (newCalendar) {
    const calendar = await context.prisma.calendar.update({
      where: {id: newCalendar.id},
      data: {
        externalId: 'Calendar' + newCalendar.id
      }
    })
    return calendar;
  }
  return null;
}