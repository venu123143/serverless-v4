import bcrypt from "bcryptjs";

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // generate salt
    return bcrypt.hash(password, salt); // hash password
}

/**
 * Compare plain text with hashed password
 * @param plainPassword - Plain text password
 * @param hashedPassword - Hashed password from DB
 * @returns boolean - true if match
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}
