import { Model, sutando } from "sutando";

let _prefix = ''

export default class Consumption extends Model {
    declare id: number;
    declare amount: number;
    declare created_at: Date;
    declare updated_at: Date;

    protected table: string = _prefix + 'consumptions';

    static async migrate(prefix = '', skipOnExist = true) {
        _prefix = prefix;

        if (skipOnExist && await sutando.schema().hasTable(prefix + 'consumptions')) {
            return;
        }

        await sutando.schema().createTable(prefix + 'consumptions', table => {
            table.increments('id').primary();
            table.bigInteger('usage_id').unsigned().references('id').inTable(prefix + 'usages').onDelete('cascade');
            table.bigInteger('amount');
            table.timestamps();
        });
    }
}