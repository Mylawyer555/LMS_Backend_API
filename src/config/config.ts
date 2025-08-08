import dotenv from 'dotenv'
import {StringValue} from 'jsonwebtoken'

dotenv.config();

export enum AppEnvironment{
    DEVELOPMENT = "development",
    PRODUCTION = "production"
}

type Config = {
    paystack: {
        secretKey: string;
        publicKey: string;
        callbackUrl: string;
    };
    app: {
        port: string | number;
    };
    jwt: {
        secret: string;
        expires: StringValue | number;
        refresh_expires: StringValue | number;
    };
    cloudinary: {
        cloud_name: string;
        api_key: string;
        api_secret: string;
    };
    redis: {
        host: string;
        port: string;
        password?: string;
    };
}

const configuration:Config = {
    paystack: {
        secretKey: process.env.PAY_STACK_SECRET || "",
        publicKey: process.env.PAY_STACK_PUBLIC || "",
        callbackUrl: process.env.PAYSTACK_CALLBACK_URL || "http://localhost:3010/api/v1/enrollments/verify", //UPDATE AS NEEDED 
    },
    app: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || "",
        expires: (process.env.JWT_ACCESS_EXPIRES_IN as StringValue) || "1h",
        refresh_expires: (process.env.JWT_REFRESH_EXPIRES_IN as StringValue) || "30d",
    },  
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_NAME || "",
        api_key: process.env.CLOUDINARY_API_KEY || "",
        api_secret: process.env.CLOUDINARY_API_SECRET || "",
    },
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD,
    },
}


export default configuration;


