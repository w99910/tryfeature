import { Model, sutando } from "sutando";

let _prefix = ''
export default class Ability extends Model {
    declare id: number;
    declare name: string;
    declare user_id: number;
    declare expired_at: Date;
    declare created_at: Date;
    declare updated_at: Date;

    protected table: string = _prefix + 'abilities';

    static async migrate(prefix = '', skipOnExist = true) {
        _prefix = prefix;

        if (skipOnExist && await sutando.schema().hasTable(prefix + 'abilities')) {
            return;
        }

        await sutando.schema().createTable(_prefix + 'abilities', table => {
            table.increments('id').primary();
            table.string('name');
            table.bigInteger('user_id').unsigned().references('id').inTable(prefix + 'users').onDelete('cascade');
            table.bigInteger('spend');
            table.datetime('expired_at');
            table.timestamps();
        });
    }

}