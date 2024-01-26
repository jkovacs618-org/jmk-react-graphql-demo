# Demo app for ReactJS and Apollo GraphQL

This web application is a tool to organize personal data such as Events, Accounts for services, and Family members.  It demonstrates a fully-working app with React components using an Apollo GraphQL server as the backend, supporting Lists and CRUD operations with nested relational data.

There is a Demo user to login with, seeded with test data, and supports creating a new account and adding/editing/removing records. The data is persisted to a SQLite database (serverless, file-based) so that subsequent loads of the GraphQL server and web app will recall the local data.

Technologies used:

* Front-end: React, TypeScript, Apollo Client (GraphQL), MobX (store), Vite, Yarn
* Back-end: Apollo GraphQL Server, Prisma (ORM), SQLite (file DB), Yarn
* UI/Styles: Tailwind CSS, Flowbite, FontAwesome
* Testing: Jest, ts-jest, React Testing Library, Apollo Client mocks

## Prerequisites:

Globally installed:
* nvm
* npm (10.2+)
* npx (10.2+)
* node (v18.19.0)
* yarn (1.22+)

```bash
nvm install v18.19.0
npm install --global yarn
```

## React App Setup:

In the first terminal, run commands in the root path of the repo:

```bash
cd path/to/repo/
cp .env.example .env
nvm use
yarn install
```

> Optional: Customize the React app Port 5174 for Vite in the root .env (set VITE_NODEJS_PORT).


## GraphQL Server Setup:

In the second terminal, run commands in the server/ sub-directory:

```bash
cd server/
cp .env.example .env
nvm use
yarn install
```

> Optional: Customize the GraphQL server Port 4001 in ./server/.env (set PORT), and in root .env (set VITE_GRAPHQL_BASE_URL port).

Generate the Prisma Client from DB schema:

```bash
cd server/
npx prisma generate
```

<details>
  <summary>Details</summary>
  This generates the Prisma Client to node_modules/@prisma/client from schema for use by the GraphQL server.<br/>
  The prisma/migrations folder and prisma/dev.db (SQLite DB) are committed to the repo for Demo purposes.
</details>


## Start the GraphQL server:

In second terminal (keep open and running):

```bash
cd server/
yarn start
```

Expected Output:
```bash
GraphQL Server ready at: http://localhost:4001/
```

## Start the React app:

In the first terminal, start the React app with Vite:

```bash
cd path/to/repo/
yarn dev
```

## Login with Demo User:

> Visit: http://localhost:5174/

The Demo User credentials will be filled in to the Login form by default:

* Email: user@example.org<br/>
* Password: password<br/>

Explore the Family, Events, and Accounts sections, with search, add, edit, and delete actions for each.

## Run Jest tests for React app

Included tests for pages

```bash
cd path/to/repo/
yarn test
```

Expects 4 tests to Pass for Login, Register, Dashboard, and Page Not Found. Uses mock data for Apollo Client queries.
<br/>

# Optional Actions:

## Run Apollo Studio to query the local GraphQL server:

> Visit http://localhost:4001/

This will load a splash page to redirect to this remote site with specific endpoint/port set: https://studio.apollographql.com/sandbox/explorer

## Run Prisma Studio to view DB data in SQLite:

To load the Prisma Studio local application locally and view the DB data directly:

```bash
cd server/
npx prisma studio
```
> Visit http://localhost:5555/

## Reset DB and Seed Data:

To clear all SQLite database tables of data, and run the Seed script again:

```bash
cd server/
npx prisma migrate reset
```

## Recreate SQLite DB from schema and Regenerate Prisma Client:

After any DB schema changes, recreate the migration, DB file, Seed data, and prisma client:

```bash
cd server/
rm -rf prisma/migrations/ prisma/dev.db
npx prisma migrate dev --name "init"
npx prisma generate
```

## To pull Repo with local DB changes:

Since the SQLite DB is stored in a committed file of server/prisma/dev.db, any data changes requires reverting the file before git pull.

```bash
cd path/to/repo/
git checkout -- .
git pull
```
