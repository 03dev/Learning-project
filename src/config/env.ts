import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "3000",
  ACCESSTOKEN: process.env.ACCESS_TOKEN_SECRET!,
  REFRESHTOKEN: process.env.REFRESH_TOKEN_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
};