export type Person = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  joined: Date;
  lastSeen: Date;
  active: boolean;
};

export const ROLES: readonly Person['role'][] = ['Admin', 'Editor', 'Viewer'];

export const people: readonly Person[] = [
  {
    id: 101,
    name: 'Ada Lovelace',
    email: 'ada@analytical.org',
    role: 'Admin',
    joined: new Date('2021-03-14'),
    lastSeen: new Date('2026-10-20T09:15'),
    active: true,
  },
  {
    id: 102,
    name: 'Grace Hopper',
    email: 'grace.hopper@gmail.com',
    role: 'Admin',
    joined: new Date('2021-06-01'),
    lastSeen: new Date('2026-10-22T16:40'),
    active: true,
  },
  {
    id: 103,
    name: 'Alan Turing',
    email: 'alan@bletchley.uk',
    role: 'Editor',
    joined: new Date('2022-01-10'),
    lastSeen: new Date('2026-09-02T11:05'),
    active: false,
  },
  {
    id: 104,
    name: 'Margaret Hamilton',
    email: 'margaret@apollo.dev',
    role: 'Editor',
    joined: new Date('2022-04-22'),
    lastSeen: new Date('2026-10-21T08:30'),
    active: true,
  },
  {
    id: 105,
    name: 'Linus Berg',
    email: 'linus.berg@gmail.com',
    role: 'Viewer',
    joined: new Date('2022-09-05'),
    lastSeen: new Date('2026-10-18T19:20'),
    active: true,
  },
  {
    id: 106,
    name: 'Katherine Johnson',
    email: 'katherine@nasa.example',
    role: 'Editor',
    joined: new Date('2023-02-17'),
    lastSeen: new Date('2026-10-22T07:55'),
    active: true,
  },
  {
    id: 107,
    name: 'Dennis Ritchie',
    email: 'dennis@bell-labs.example',
    role: 'Viewer',
    joined: new Date('2023-05-30'),
    lastSeen: new Date('2026-07-14T14:10'),
    active: false,
  },
  {
    id: 108,
    name: 'Hedy Lamarr',
    email: 'hedy.lamarr@gmail.com',
    role: 'Viewer',
    joined: new Date('2023-11-08'),
    lastSeen: new Date('2026-10-19T21:45'),
    active: true,
  },
  {
    id: 109,
    name: 'Tim Berners-Lee',
    email: 'tim@cern.example',
    role: 'Admin',
    joined: new Date('2024-01-25'),
    lastSeen: new Date('2026-10-23T08:00'),
    active: true,
  },
  {
    id: 110,
    name: 'Radia Perlman',
    email: 'radia@routing.example',
    role: 'Editor',
    joined: new Date('2024-08-12'),
    lastSeen: new Date('2026-10-05T10:25'),
    active: true,
  },
  {
    id: 111,
    name: 'Ken Thompson',
    email: 'ken.thompson@gmail.com',
    role: 'Viewer',
    joined: new Date('2025-03-03'),
    lastSeen: new Date('2026-08-28T17:50'),
    active: false,
  },
  {
    id: 112,
    name: 'Barbara Liskov',
    email: 'barbara@substitution.example',
    role: 'Editor',
    joined: new Date('2025-10-01'),
    lastSeen: new Date('2026-10-22T13:35'),
    active: true,
  },
];
