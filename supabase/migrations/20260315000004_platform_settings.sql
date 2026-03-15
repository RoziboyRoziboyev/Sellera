create table public.platform_settings (
  id integer primary key default 1,
  card_number text,
  receiver_name text
);

insert into public.platform_settings (id, card_number, receiver_name) values (1, '8600 1234 5678 9012', 'Safia Sales');
