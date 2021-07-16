# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :jeeves,
  ecto_repos: [Jeeves.Repo]

# Configures the endpoint
config :jeeves, JeevesWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "LNrfU+X+q2/QkwGS+HFCJJwLKSwv3/Y7ZNTVc2mZjaBdVcHIwbPlKE9aqPb10gqa",
  render_errors: [view: JeevesWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Jeeves.PubSub,
  live_view: [signing_salt: "O4JTdRkO"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
