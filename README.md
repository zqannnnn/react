Bounty Management Platform
==========================


Development Quickstart
----------------------

Requires docker, docker-compose

After a fresh clone you need build container first,use:

```sh
docker-compose build
```
if you want to fetch deps, use:

```sh
./bin/yarn install
```

Now that the deps are there, we can start for realz:

```sh
docker-compose up
```

Note that `./src/` and `./frontend` are now mounted with livereload

### Managing Dependencies

You can use `yarn` inside of a container by using the `./bin/yarn`  scripts.

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
password and `bmp-db` as the host.

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

### i18n solution

First,extract pot file,use:

```sh
./bin/yarn run extract-translation
./bin/yarn run json2pot
```
Then translate pot file get po file

Then resolve po file,use:

```sh
./bin/yarn run pot2json
```
Then set json files in /frontend/src/index/tsx
