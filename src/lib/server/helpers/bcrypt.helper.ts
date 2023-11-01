import { compare, hash } from 'bcrypt';

export function hashPassword(password: string) {
	return hash(password, 8);
}

export function isValidPassword(password: string, encryptedPassword: string) {
	return compare(password, encryptedPassword);
}
