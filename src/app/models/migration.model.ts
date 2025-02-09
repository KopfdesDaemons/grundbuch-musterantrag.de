export class Migration {
    name: string = '';
    description: string = '';
    migrate: Function = () => { };

    constructor(name: string, description: string, migrate: Function) {
        this.name = name;
        this.description = description;
        this.migrate = migrate;
    }
}