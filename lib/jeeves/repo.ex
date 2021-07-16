defmodule Jeeves.Repo do
  use Ecto.Repo,
    otp_app: :jeeves,
    adapter: Ecto.Adapters.Postgres
end
