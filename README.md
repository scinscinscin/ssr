### SSR Template

A template for creating projects using scinstack

### Features
 - Easy + typesafe layouts using Next.js pages router using [`@scinorandex/layout`](https://github.com/scinscinscin/layout)
 - End to end API typesafety using [`@scinorandex/rpscin`](https://github.com/scinscinscin/rpscin)
 - GraphQL capabilities using [`@scinorandex/yoko`](https://github.com/scinscinscin/yoko)
 - Provides better types for Next.js functions (makes `params` non optional for gSP / gSSP contexts, makes `getStaticPaths` return type concrete)
 - Supports component level server-side data fetching using a [`useSSE`](https://github.com/kmoskwiak/useSSE) fork

### Pre-setup libraries
 - Has Font Awesome configured using [`react-fortawesome`](https://fortawesome.com/)
 - Comes with [`react-toastify`](https://www.npmjs.com/package/react-toastify), [`next-seo`](https://www.npmjs.com/package/next-seo), [`react-hook-form`](https://www.npmjs.com/package/react-hook-form) preinstalled
 - Uses SCSS modules using [`sass`](https://www.npmjs.com/package/sass)
 - JWT and Session Authentication, login and registration routes already setup for username & password, and support for Google OAuth using passport
 - Uses Prisma as the database ORM

### To run
1. Clone this repository
2. Install the packages with `yarn`
3. Run `yarn migrate` to initialize the database
4. Copy `.env.example` to `.env` and fill any necessary fields
5. Run `yarn dev`

### TODO
1. Add Redis support for production
2. Improve docker support
3. Modify schema.prisma to support postgres instead of just SQLite
4. Setup nodemailer for registration verification
5. Setup ReCaptcha
6. Setup GitHub actions that compiles and lints the application