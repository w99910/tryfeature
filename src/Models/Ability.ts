import { Model, sutando } from "sutando";

let _prefix = ''
export default class Ability extends Model {
    id!: number;
    name!: string;
    user_id !: number;
    expired_at!: Date;
    created_at!: Date;
    updated_at!: Date;

    protected table: string = _prefix + 'abilities';

    static async migrate(prefix = '') {
        _prefix = prefix;
        await sutando.schema().createTable(_prefix + 'abilities', table => {
            table.increments('id').primary();
            table.string('name').unique();
            table.bigInteger('user_id').unsigned().references('id').inTable(prefix + 'users').onDelete('cascade');
            table.bigInteger('spend');
            table.datetime('expired_at');
            table.timestamps();
        });
    }

}