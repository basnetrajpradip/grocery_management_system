# Grocery Management System

Welcome to the repository of Grocery Management System. This repository contains the code for the Grocery manage system, a web based app to manage the product sales sold by the employee/s.

---

## Live Preview

Live preview of the web app is [Here](https://pradip-grocery-management-system.vercel.app/).

---

![Grocery_Management_1](https://github.com/user-attachments/assets/81369568-6fc7-4d9d-9cf2-00a7444173b4)
![Grocery_Management_2](https://github.com/user-attachments/assets/413d972e-b2c3-4123-bdc6-f1b38b094453)

---

## About Chit Chat App

The Grocery Management System App is a comprehensive platform designed to streamline the management and sale of grocery products. This app caters to two primary user roles: Admin and User, each with distinct capabilities and access levels to ensure efficient operation and management of the grocery business.

---

## Features

- **Product and Category management:** Admins can create and manage product categories to organize the inventory effectively.
- **User Management:** Admins can create user accounts that grant access to the grocery management system for sales operations.
- **Dashboard Insights:** Admins have access to a comprehensive view of all available products,products sold,revenue generated,sales etc.
- **User Performance:** Admins can monitor the performance of individual users, including sales figures and activity metrics.
- **Sales Operations:** Users having access can process sales transactions, ensuring smooth and accurate recording of purchases.
- **Responsive Design:** Mobile-friendly design ensures a seamless browsing experience across devices of all sizes.

---

## Technologies Used

- **Next JS:** Front-end React framework for building production ready dynamic and interactive user interfaces.
- **PostgreSQL:** A free and open-source relational database management system.
- **Zod:** A TypeScript-first schema declaration and validation library.
- **Prisma ORM:** An Object Relational Mapper.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building modern websites.
- **Next Auth:** Secured and flexible authentication library designed to sync with any OAuth service.
- **Shadcn UI:** A component library that functions as a plugin for TailwindCSS.
- **Vercel Blob:** A scalable object storage service for static assets, such as images, videos, audio files, and more.

---

## Getting Started

To get started with the DevDash Blog client-side application, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies using npm:

   ```bash
   npm install
   ```

> **Note:** This Next JS app uses a PostgreSQL database either hosted locally or hosted on cloud platform. If it is a locally hosted database edit the schema.prisma file such that

```bash
# prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") //"Remove this line for locally hosted db"
}

```

So inorder to make the app function, One must create a database and add the connection string by creating .env file at root of the project as:

```bash
# .env file
DATABASE_URL= <"your db connection string">
DIRECT_URL = <"For cloud hosted database if given">
```

4. Similarly we need to add one more environment variables inorder to get the client app up and running. Add the following env variable in the .env file along with DATABASE_URL.

```bash
# .env file
NEXTAUTH_SECRET= <"secret key string for next auth">
BLOB_READ_WRITE_TOKEN= <"Create storage at vercel blob and paste the token in .env file">
```

> **Note:** You can either put some random string in secret key string or generate the secret key string by running node as REPL in your terminal as:

```bash
# run node as REPL
node

#generate string for secret key
require("crypto").randomBytes(64).toString("hex")
```

6. Finally, start the dev server as:

   ```bash
   npm run dev
   ```
