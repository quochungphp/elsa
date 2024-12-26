export interface AuthSigninPayloadDto {
    username: string;
    password: string;
    rememberMe?: boolean;
}
export interface ResponseDto {
    status?: 'success' | 'error';
    errors?: ErrorResponse[];
}

export enum LOGIN_PROVIDER {
    PASSWORD = 'PASSWORD',
}

export interface UserResponseDto extends ResponseDto {
    id: number;
    fullName: string;
    username: string;
    password: string;
    email: string;
    phone: number;
    token?: string;
    createdAt: Date;
    updatedAt?: Date;
}
export interface ErrorResponse {
    code: number;
    title: string;
    detail: string;
    correlationID: string;
    timestamp: Date;
    path: string;
}

export interface UserSignUpPayloadDto {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface CommentResponseDto {
    id: number;
    text: string;
    level: number;
    parentId: number;
    userId: number;
    createdAt: Date;
    updatedAt?: Date;
}
