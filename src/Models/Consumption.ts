import { Model, sutando } from "sutando";

let _prefix = ''

export default class Consumption extends Model {
    id!: number;
    amount!: number;
    created_at!: Date;
    updated_at!: Date;

    protected table: string = _prefix + 'consumptions';

    static async migrate(prefix = '') {
        _prefix = prefix;
        await sutando.schema().createTable(prefix + 'consumptions', table => {
            table.increments('id').primary();
            table.bigInteger('usage_id').unsigned().references('id').inTable(prefix + 'usages').onDelete('cascade');
            table.bigInteger('amount');
            table.timestamps();
        });
    }
}