
# elsa-test

WebSocket-based and RESTful Web Services for wager features

## Prerequisites

The following tools need to be installed:

- [Git](http://git-scm.com/)
- [Node.js 18+](http://nodejs.org/)
- [Docker](https://www.docker.com/get-started/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [NestJS Framework](https://github.com/nestjs/nest)
- [DBeaver Community - Free Universal Database Tool](https://dbeaver.io/download/)

## Installation

```bash
git clone <repository-url>
cd <repository-url>
npm install
```

## Configure environment variables

### Supported environments

- Local
- Dev
- Staging
- Production

### Update values inside the `configs/.config.$ENVIRONMENT.json`

`Noted`: new variables must be added to all file to synchronize with other environments

```bash
.
├── configs
│   ├── config.local.json
│   ├── config.dev.json
│   ├── config.staging.json
|   └── config.prod.json
```

## Running the app on a specific environment

### Docker container

```bash
# start docker container support multi instances WebSocket to verify scalability in high traffic
$ npm run docker:start:$env

```

### Local machine

```bash
# A PostgreSQL instance must ready for connection on host port 5432
## start docker container docker if it does not exist
$ npm run docker:start:db

# start local server
$ npm run start:$env
```

## How to migrate your data

```bash
# Create migration file (First time only). `Always keep the file there`
## Create the list file of migration with timestamps
## Filename is the module/table need to migrate
npm run migration:create --name=example


# Generate script base on the changes from modules/table
## Filename will be generated as: `timestamp_filename.ts`
## Rename the Filename to: `timestamp_Update${Table}.ts`
npm run migration:generate --name=example


# Run this command before running `Run migration`
## On your local environment
export IS_LOCAL_MACHINE=true
## Other environments
export IS_LOCAL_MACHINE=false

# Run migration
## Execute all of command for migration for both init database and update changes
## If the migration file name is already executed, then the scripts automatically ignore migration
npm run migration:run:local

## Run on a specific environment local | dev | stg | prod
### Update the environment variable in the config.$env.json first
### Run the following command. Replace $env accordingly
npm run env:$env
npm run migration:run
```

## API Documentation use Swagger

- [Local/api-docs](http://localhost:9000/v1/api-docs/)

[Swagger Specification](https://swagger.io/specification/)

## Collaboration

1. Follow TypeScript Style Guide [Google](https://google.github.io/styleguide/tsguide.html) except filename use dashes and dots as NestJS is following angular e.g `user-get-action.service.ts`
2. Follow [REST Resource Naming Guide](https://restfulapi.net/resource-naming/)
3. Follow Best-Practices in coding:
   - [Clean code](https://github.com/labs42io/clean-code-typescript) make team happy
   - [Return early](https://szymonkrajewski.pl/why-should-you-return-early/) make code safer and use resource Efficiency
   - [Truthy & Falsy](https://frontend.turing.edu/lessons/module-1/js-truthy-falsy-expressions.html) make code shorter
   - [SOLID Principles](https://javascript.plainenglish.io/solid-principles-with-type-script-d0f9a0589ec5) make clean code
   - [DRY & KISS](https://dzone.com/articles/software-design-principles-dry-and-kiss) avoid redundancy and make your code as simple as possible
4. Make buildable commit and pull latest code from `dev` branch frequently. Enable rebase when pull `$ git config --local pull.rebase true`
5. Use readable commit message [karma](http://karma-runner.github.io/6.3/dev/git-commit-msg.html)

```bash
     /‾‾‾‾‾‾‾‾
🔔  <  Ring! Please use semantic commit messages
     \________


<type>(<scope>): ([issue number]) <subject>
    │      │        |             │
    |      |        |             └─> subject in present tense. Not capitalized. No period at the end.
    |      |        |
    │      │        └─> Issue number (optional): Jira Ticket or Issue number
    │      │
    │      └─> Scope (optional): eg. Articles, Profile, Core
    │
    └─> Type: chore, docs, feat, fix, refactor, style, ci, perf, build, or test.
```
## Check list 
![Screenshot 2024-12-27 at 10 07 01 AM](https://github.com/user-attachments/assets/6b7b56cc-efdd-4941-b144-240d8f56a941)
![Screenshot 2024-12-27 at 10 07 11 AM](https://github.com/user-attachments/assets/2c21e1f7-e3d1-4f4f-a851-08bf48cf5612)

