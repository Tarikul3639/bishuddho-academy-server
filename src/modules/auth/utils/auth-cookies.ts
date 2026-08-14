import type { Response } from 'express';

import ms, { type StringValue } from 'ms';

const isProduction = process.env.NODE_ENV === 'production';

export function setAuthCookie(
  res: Response,
  accessToken: string,
  expiresIn: StringValue = '7d',
) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: ms(expiresIn),
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });
}

export function getAccessTokenFromCookies(req: {
  cookies?: Record<string, string>;
}): string | null {
  return req.cookies?.access_token ?? null;
}
