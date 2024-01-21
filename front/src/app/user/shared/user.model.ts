import { UserDto } from "src/app/Shared/models/user.models";

export class User {
    username: string = "";
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    birthday: number = 0;
    birthdayDate: Date;
    address: string = "";
    constructor(dto?: UserDto) {
        if (dto) {
            this.username = dto.username;
            this.email = dto.email;
            this.firstName = dto.firstName;
            this.lastName = dto.lastName;
            this.birthday = dto.birthday;
            this.birthdayDate = new Date(dto.birthday);
            this.address = dto.address;
        }
    }

}