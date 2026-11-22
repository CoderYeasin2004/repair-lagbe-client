import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGO_DB_AUTH_URI as string)
const db = client.db("repair-lagbe-db")

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ['customer', 'technician', 'admin'],
        input: true,
        defaultValue: 'customer',
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
   plugins: [
        admin()
    ],
  database: mongodbAdapter(db, {
    client,
  }),
})
