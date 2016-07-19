#Firebase AWS S3 Backup

NodeJS app that regularly saves the contents of your Firebase Database in JSON format into an Amazon AWS S3 bucket

###ENV VARS Required
``` plaintext
NODE_ENV=

FIREBASE_DATABASE_URL=
FIREBASE_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

BUCKET_NAME=
STATIC_NAME=

SAVE_INTERVAL_MINUTES=
```