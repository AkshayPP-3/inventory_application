import arcjet,{tokenBucket,shield,detectBot} from "@arcjet/node";
import "dotenv/config"

const getRequiredEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is required in .env`);
    }
    return value;
};

const arcjetKey = getRequiredEnv("ARCJET_KEY");

export const aj = arcjet({
    key: arcjetKey,
    rules: [],
})