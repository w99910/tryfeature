import { Model } from "sutando";
export default class Consumption extends Model {
    id: number;
    amount: number;
    created_at: Date;
    updated_at: Date;
    protected table: string;
    static migrate(prefix?: string, skipOnExist?: boolean): Promise<void>;
}
//# sourceMappingURL=Consumption.d.ts.map