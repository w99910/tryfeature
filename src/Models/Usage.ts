import { Model, sutando } from "sutando";
import Consumption from "./Consumption";

let _prefix = ''

export default class Usage extends Model {
    declare id: number;
    declare name: string; // name is not unique
    declare total: number;
    declare spend: number;
    declare expired_at: Date;
    declare created_at: Date;
    declare updated_at: Date;

    protected table: string = _prefix + 'usages';

    static async migrate(prefix = '', skipOnExist = true) {
        _prefix = prefix;
        if (skipOnExist && await sutando.schema().hasTable(prefix + 'usages')) {
            return;
        }
        await sutando.schema().createTable(prefix + 'usages', table => {
            table.increments('id').primary();
            table.string('name');
            table.bigInteger('total');
            table.bigInteger('spend');
            table.bigInteger('user_id').unsigned().references('id').inTable(prefix + 'users').onDelete('cascade');
            table.datetime('expired_at');
            table.timestamps();
        });
    }

    relationConsumptions() {
        return this.hasMany(Consumption);
    }

    async consume(amount: number) {
        const consumption = new Consumption({
            amount: amount,
        })

        await (this as Usage).related('consumptions').save(consumption);

        this.spend += amount;
        this.save();

        return consumption;
    }
}