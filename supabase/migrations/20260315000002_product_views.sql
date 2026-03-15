-- Add Views column
alter table public.products add column views integer default 0 not null;

-- RPC to increment views securely
create or replace function public.increment_product_views(p_id uuid)
returns void as $$
begin
  update public.products
  set views = views + 1
  where id = p_id;
end;
$$ language plpgsql security definer;
