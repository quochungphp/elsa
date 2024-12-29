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

Run docker service all in one by npm script

```bash
$ npm run docker:build:local
```

Run docker service build and run

```bash
$ docker compose -f docker-compose.local.yml build --no-cache
$ docker compose -f docker-compose.local.yml  up --build
```

```bash
# A PostgreSQL instance must ready for connection on host port 5432 and already run latest migration
## start docker container docker if it does not exist
$ npm run docker:start:redis
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

Backend

- Setup source
- Websocket Io
- Implement logic leaderboad, score, quiz, user

## Frontend

- Setup source code
- Establish socket io connection
- Implement logic and page container of leaderboard, quiz, score ... are processing
  ![Screenshot 2024-12-27 at 10 07 01 AM](https://github.com/user-attachments/assets/6b7b56cc-efdd-4941-b144-240d8f56a941)
  
  ![Screenshot 2024-12-27 at 10 07 11 AM](https://github.com/user-attachments/assets/2c21e1f7-e3d1-4f4f-a851-08bf48cf5612)
  
  <img width="1416" alt="Screenshot 2024-12-27 at 10 15 08 AM" src="https://github.com/user-attachments/assets/7cd93f67-a8a4-47f5-8c40-46b1fdd3cd55" />
  
  ![Screenshot 2024-12-27 at 10 15 25 AM](https://github.com/user-attachments/assets/574f6ed0-402e-4619-a549-c3097ff5a7c8)
  
  ![Screenshot 2024-12-28 at 9 14 24 PM](https://github.com/user-attachments/assets/84b6ca44-7f8c-4624-9319-604a0d920f00)

  ![Screenshot 2024-12-29 at 9 49 03 PM](https://github.com/user-attachments/assets/5426f142-a186-48e4-bea5-d6cf754c2bff)

