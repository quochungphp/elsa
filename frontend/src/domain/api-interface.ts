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


export interface QuizzesDto {
    status: string;
    data:   Quiz[];
}
export interface QuizDto {
    status: string;
    data:   Quiz;
}
export interface Quiz {
    _id:          string;
    title:        string;
    participants: ParticipantDto[];
    createdAt:    Date;
    updatedAt:    Date;
    __v:          number;
}

export interface ParticipantDto {
    _id: string;
}


export interface QuestionListDto {
    status: string;
    data:   QuestionDto[];
}

export interface QuestionDto {
    _id:           string;
    quizId:        string;
    questionText:  string;
    options:       any[];
    correctAnswer: number;
    createdAt:     Date;
    __v:           number;
}

export interface SigninJoin {
    status: string;
    data:   User;
}

export interface User {
    _id:       string;
    name:      string;
    email:     string;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}
