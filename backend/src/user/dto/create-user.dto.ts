// src/user/dto/create-user.dto.ts
export class CreateUserDto {
    username: string;
    firstname?: string;
    lastname?: string;
    gender?: string;
    age?: number;
    email: string;
    password_hash?: string;
    google_id?: string;
    // вместо передачи объекта Role можно передать его id
    roleId: number;
    is_active?: boolean;
    is_social?: boolean;
    refresh_token_hash?: string;
    avatar_base64?: string;
    avatar_mime_type?: string;
}
