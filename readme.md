# Read Me!

# Install Dependencies
- **Backend**: npm i && npm run dev (for development) || npm start (for production)

# Technologies and Tools
-   **Node.js**
-   **JavaScript**
- **Express**
- **SendGrid**
- **Postman**
- **MongoDB atlas** (needed for sharding and cluster, can't perform transactions on standalone cluster)

# Features
-   **Create, Update and Send operations**:Admin can  Create list, add Users to the list, Send email to all users in a List.

# Dependencies
- **Use Ethereal for testing purpose**:
- ---> Link: https://ethereal.email/
- ---> Steps: Click on "create Ethereal account" get this code snippet 
- ---> const transporter = nodemailer.createTransport({
-            host: 'smtp.ethereal.email',
-            port: 587,
-            auth: {
-              user: 'geovanni.durgan@ethereal.email',
-             pass: 'vJTZEwVGA9dcj6BYmD'
-           }
-      });

- --->paste it in the ./utils/emailService.js

- **SendGrid for production** : update your env key

# env vars
- MONGO_URI=(mongoDB atlas key)
- PORT=
- NODE_ENV=
- SENDGRID_API_KEY=
- NAME=
- EMAIL=
- FRONT_END_URL=





