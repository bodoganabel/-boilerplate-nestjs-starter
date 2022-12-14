import { EPermissions } from 'src/auth/permission.schema';

export const usersInit = [
  {
    username: 'admin',
    password: '$2b$10$WFS2aib5jttr8rrh9QCnYukBJbwnNrg.dyZv6vtt8NZa0RmHPYXGO', //Pw12345_
    permissions: [...Object.values(EPermissions)],
  },
  {
    username: 'user',
    password: '$2b$10$WFS2aib5jttr8rrh9QCnYukBJbwnNrg.dyZv6vtt8NZa0RmHPYXGO', //Pw12345_
    permissions: [],
  },
];
