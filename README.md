Bounty Management Platform
==========================


Development Quickstart
----------------------

Requires docker, docker-compose

After a fresh clone if you want to fetch deps, use:

```sh
./bin/fetchdeps
```

Now that the deps are there, we can start for realz:

```sh
docker-compose up
```

Note that `./src/` and `./frontend` are now mounted with livereload

### Managing Dependencies

You can use `yarn` and `elm` inside of a container by using the `./bin/yarn` and
`./bin/elm` scripts.

### Rebuilding Container

When changing project files outside of `./src/` and `./frontend`, you might want
to rebuild the containers:


```sh
docker compose down
docker-compose build
docker-compose up
```

### Accessing Postgres

The default development config has `postgres` as the database name, user and
password and `bms-db` as the host.

#### Using Adminer

When using docker-compose you can access the Adminer gui
[in your browser](http://localhost:8011/?pgsql=bmp-db&username=postgres&db=postgres)

#### Using psql

For the psql cli:

```sh
docker exec -u postgres -it bmp-db psql
```

You can also import a sql file:

```sh
docker exec -u postgres -i bmp-db psql < dump.sql
```

### Using tslint

To check for stylistic errors, use:

```sh
./bin/tslint
```

Also try to automagically fix them like so:

```sh
./bin/tslint --fix
```

