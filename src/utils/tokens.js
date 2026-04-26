import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const ACCESS_TOKEN_MINUTES = 30;
export const REFRESH_TOKEN_DAYS = 7;

export const signaccessToken = async (payload) => {
    // console.log("payload",payload)
    return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn : `${ACCESS_TOKEN_MINUTES}m`,
    })
}

export const signrefreshToken = async (payload) => {
    // console.log("payload",payload)
    return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn : `${REFRESH_TOKEN_DAYS}d`
    })
}

export const passwordMatch = async (plainPassword, hashedPassword) => {
    // console.log("...plainPassword.......",plainPassword)
    // console.log("...hashedPassword.......",hashedPassword)
    if (!plainPassword || !hashedPassword) {
        throw new Error("Password missing for compare");
    }
    return await bcrypt.compare(plainPassword, hashedPassword)
}