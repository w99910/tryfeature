import { Model } from "sutando";
export default class Ability extends Model {
    id: number;
    name: string;
    user_id: number;
    expired_at: Date;
    created_at: Date;
    updated_at: Date;
    protected table: string;
    static migrate(prefix?: string, skipOnExist?: boolean): Promise<void>;
}
//# sourceMappingURL=Ability.d.ts.map