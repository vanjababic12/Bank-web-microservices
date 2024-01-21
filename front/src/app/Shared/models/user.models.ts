export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    birthday?: number;
    address?: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    birthday?: number;
    address?: string;
}

export interface UserDto {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    birthday: number;
    address: string;
    role: string;
}

export interface SuccessLoginDto {
    token: string;
    role: string;
}
