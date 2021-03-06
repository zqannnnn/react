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
docker-compose down
rm -rf node_modules
./bin/yarn install
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

tslint now will do both checking for stylistic errors and format code, use:

```sh
./bin/yarn run lint
```

### database migration

#### For development

To create a new migration use:

```sh
docker exec bmp-app yarn sequelize migration:create --name :migration-name 
```

A migration js file will created in db/migrations/, then edit this js file to record your changes in database, use [this api](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html) 

To use newest migration:

```sh
docker exec bmp-app yarn sequelize db:migrate 
```

To undo newest migration:

```sh
docker exec bmp-app yarn sequelize db:migrate:undo
```

More information check [here](http://docs.sequelizejs.com/manual/tutorial/migrations.html)

### i18n solution

#### Fronend translations

Locales files are in: frontend/src/locales

You can add translation like this:

```sh
import { Trans } from "react-i18next"
...
...
...
<Trans>
    Some key text
</Trans>
```

or like this:

```sh
import { translate } from "react-i18next"
...
...
...
var t = (this.props as any).t
{t("Some key text")}
...
...
...
export default translate("translations")(connect(mapStateToProps)(Component))
```

or like this:

```sh
import i18n from "i18next"
...
...
...
{i18n.t('Some key text')}
```

after adding translations to components run:

```sh
i18next-scanner --config i18n/i18next-scanner.config.js "frontend/**/*.{ts,tsx}"
```

it will add missing translation keys to locale .json files

#### Backend translations

Locales files are in: src/locales

To add translation to file

```sh
import i18n from "i18next"
...
...
...
i18n.t('Some key text')
...
i18n.t('reset-password-email', { ourName: ourName, email: email, resetUrl: resetUrl })
```

to generate translation keys for new added translations run:

```sh
i18next-scanner --config i18n/i18next-scanner-backend.config.js "src/**/*.{ts,tsx}"
```
> Note: if you translating whole email or something realy long, 
> please add a new key manually to locales files (not with script).
> To keep keys readable.

To manage translation is convinient to use https://poeditor.com/, 
we don't need generate .po files, we can just use json files for that.
Anyway i18next provide easy way to generate .po files if we'll need it in feature.

to change languge programmatically use: i18n.changeLanguage(lng)

here some example of using i18next:
https://codesandbox.io/s/8n252n822

### Deployment & Production

To deploy your changes to server just merge your branch to **deploy** branch.
All settings for production already done except two things: 
* is some problem to use only **prod** dependencies for yarn (probably cause confusing with --save-dev in instalation process )
* CSS still not minified


### Import Currency

```sh
docker exec -u postgres -i bmp-db psql < script/currency.sql
```

### Tesing

For testing used [jest library](https://facebook.github.io/jest/).
It have lot of additions and testing process can be developed in more sophisticated way.
Bur for now it just example for reducers testing.

to run tests:

```sh
yarn test
```

### Chat

To open chat with an user, execute window.Chat.openChat("user-id"), or use ChatButton component to add button opening chat for specific user.

All history of chats is available in page in main menu 'My account' -> 'My Chats'



### React components library

For viewing all components in library page [React StyleGuidist library](https://github.com/styleguidist/react-styleguidist).

To add component into library page

First, create a component.md file, filename is same with the component you want to add,and put into same folder

Second, add example in md file according to [here](https://react-styleguidist.js.org/docs/documenting.html#usage-examples-and-readme-files)

to run styleguidist server:

```sh
npx styleguidist server
```

PS: there is a wrapper file in components/styleguide/, contain whole rootState for all examples