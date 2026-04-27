import dotenv from "dotenv"
dotenv.config()


if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables")
}
if (!process.env.GITHUB_CLIENT_ID) {
    throw new Error("GITHUB_CLIENT_ID is not defined in environment variables")
}
if (!process.env.GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_SECRET is not defined in environment variables")
}
if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables")
}
if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined in environment variables")
}
if (!process.env.PORT) {
    throw new Error("PORT is not defined in environment variables")
}
if (!process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error("IMAGEKIT_URL_ENDPOINT is not defined in environment variables")
}
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
    throw new Error("IMAGEKIT_PUBLIC_KEY is not defined in environment variables")
}
if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in environment variables")
}
if(!process.env.BREVO_SENDER_EMAIL){
    throw new Error("BREVO_SENDER_EMAIL is not defined in environment variables")
}
if(!process.env.BREVO_API_KEY){
    throw new Error("BREVO_API_KEY is not defined in environment variables")
}
if(!process.env.BASE_URL){
    throw new Error("BASE_URL is not defined in environment variables")
}
if(!process.env.FRONTEND_URL){
    throw new Error("FRONTEND_URL is not defined in environment variables")
}
if(!process.env.GEMINI_API_KEY){
    throw new Error("GEMINI_API_KEY is not defined in environment variables")
}
if(!process.env.GROQ_API_KEY){
    throw new Error("GROQ_API_KEY is not defined in environment variables")
}
if(!process.env.HUGGINGFACE_API_KEY){
    throw new Error("HUGGINGFACE_API_KEY is not defined in environment variables")
}
if(!process.env.TOGETHER_API_KEY){
    throw new Error("TOGETHER_API_KEY is not defined in environment variables")
}
if(!process.env.DEEPINFRA_API_KEY){
    throw new Error("DEEPINFRA_API_KEY is not defined in environment variables")
}


export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    DEEPINFRA_API_KEY: process.env.DEEPINFRA_API_KEY,
    BASE_URL: process.env.BASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
}
