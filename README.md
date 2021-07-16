# Jeeves

Portfolio of web applications using Elixir/Phoenix as the backend.

## Notes

Development/test environments configured to work with Docker and VSCode.

  * With Docker, use the `build` script to build the containers and `launch` script to start and attach to the application container.
  * In addition to Docker, if VSCode is installed and the `Remote - Containers` extension is enabled, then the application container can be opened within VSCode.

Project's `Repo` has been configured to use a Docker postgres container for its database. If not using Docker, then the configurations for `Repo` will need to be set.

## Usage

To start the web server:

  * Run `mix setup` to install dependencies, configure the database, and compile the project.
  * Start the web server with `mix phx.server`.

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.
