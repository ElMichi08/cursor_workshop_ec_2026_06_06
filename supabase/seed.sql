-- MarketLab seed data (workshop tasks add sample markets here)

insert into public.markets (id, title, description, status, close_date)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Will it rain in Quito tomorrow?',
  'A fictional Yes/No weather market for the Cursor workshop. Browse and explore with fake money—no real trades yet.',
  'open',
  now() + interval '30 days'
)
on conflict (id) do nothing;
