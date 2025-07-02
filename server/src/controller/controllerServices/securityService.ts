import jwt from 'jsonwebtoken';


export async function createToken(id: string, name: string, email: string, is_admin: boolean): Promise<string> {
    const secretKey = process.env.SECRETKEY as string | undefined;
    if (!secretKey) {
        throw new Error('Secret key is not defined');
    }
    return jwt.sign(
        {
            id,
            name,
            email,
            is_admin
        },
        secretKey,
        {expiresIn: '1 days'}
    )
}