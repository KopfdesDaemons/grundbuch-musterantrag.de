export class UserRoleOption {
    userRoleID: number;
    name: string;
    description: string;

    constructor(userRoleID: number, name: string, description: string) {
        this.userRoleID = userRoleID;
        this.name = name;
        this.description = description;
    }
}