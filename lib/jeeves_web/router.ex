defmodule JeevesWeb.Router do
  use JeevesWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {JeevesWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/", JeevesWeb do
    pipe_through :browser

    get "/", HomeController, :index
    get "/printmode-tools", PrintmodeToolsController, :index
  end
end
