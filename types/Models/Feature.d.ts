import { Model } from "sutando";
export declare enum FeatureType {
    ability = "ability",
    usage = "usage"
}
export default class Feature extends Model {
    id: number;
    name: string;
    type: FeatureType;
    description?: string;
    quantity?: number;
    created_at: Date;
    updated_at: Date;
    protected table: string;
    static migrate(prefix?: string, skipOnExist?: boolean): Promise<void>;
    static findByName(name: string): Promise<any>;
    static firstOrCreate(name: string, type: FeatureType, quantity?: number, description?: string): any;
    relationFeatureGroups(): any;
}
//# sourceMappingURL=Feature.d.ts.map