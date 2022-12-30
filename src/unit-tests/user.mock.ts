import { IUser } from '@interfaces';
import { randomEmail, randomString } from '@unit-tests';
import { ILoginPayload } from '../app/shared/services/auth.service';

export const mockUser = (override: Partial<IUser> = {}): IUser => ({
  userId: randomString(),
  username: randomString(),
  password: randomString(),
  email: randomEmail(),
  phone: randomString(),
  site: randomString(),
  avatar: randomString(),
  ...override,
});

export const mockLoginPayload = (
  override: Partial<ILoginPayload> = {},
): ILoginPayload => ({
  username: randomString(),
  password: randomString(),
  ...override,
});
