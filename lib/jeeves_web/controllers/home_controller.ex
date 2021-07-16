defmodule JeevesWeb.HomeController do
  use JeevesWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
