import { Model } from "sutando";
import Consumption from "./Consumption";
export default class Usage extends Model {
    id: number;
    name: string;
    total: number;
    spend: number;
    expired_at: Date;
    created_at: Date;
    updated_at: Date;
    protected table: string;
    static migrate(prefix?: string, skipOnExist?: boolean): Promise<void>;
    relationConsumptions(): any;
    consume(amount: number): Promise<Consumption>;
}
//# sourceMappingURL=Usage.d.ts.map