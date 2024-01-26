import jwt from 'jsonwebtoken';

export const APP_SECRET = process.env.APP_SECRET || 'MyGraphQLAppSecret';

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

export function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error('Not authenticated');
}

export async function getUser(userId, prisma) {
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }
  return null;
}
