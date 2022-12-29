import { IUser } from '@interfaces';
import { randomEmail, randomString } from '@unit-tests';

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
