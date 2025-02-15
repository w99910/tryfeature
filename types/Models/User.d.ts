import { Model } from "sutando";
import Feature from "./Feature";
import FeatureGroup from "./FeatureGroup";
import Consumption from "./Consumption";
declare class User extends Model {
    id: number;
    email: string;
    created_at: Date;
    updated_at: Date;
    protected table: string;
    static migrate(prefix?: string, skipOnExist?: boolean): Promise<void>;
    static firstOrCreate(email: string): any;
    relationAbilities(): any;
    relationUsages(): any;
    grantFeature(feature: Feature | string, expire_at: Date, error_on_duplicate?: boolean): Promise<any>;
    revokeFeature(feature: Feature | string): Promise<any>;
    grantFeatureGroup(featureGroup: FeatureGroup | string, expire_at: Date, error_on_duplicate?: boolean): Promise<any>;
    revokeFeatureGroup(featureGroup: FeatureGroup | string): Promise<boolean>;
    try(feature: Feature | string, amount?: number, dry?: boolean): Promise<boolean | Consumption[]>;
    canTry(feature: Feature | string, amount?: number): Promise<boolean | Consumption[]>;
}
export default User;
//# sourceMappingURL=User.d.ts.map