import { Model } from "sutando";
import Feature from "./Feature";
export default class FeatureGroup extends Model {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    protected table: string;
    static migrate(prefix?: string, skipOnExist?: boolean): Promise<void>;
    relationFeatures(): any;
    static findByName(name: string): Promise<any>;
    static firstOrCreate(name: string, description?: string): any;
    addFeature(feature: Feature): Promise<any>;
    removeFeature(feature: Feature): Promise<any>;
    addFeatures(features: Feature[]): Promise<void>;
    removeFeatures(features: Feature[]): Promise<void>;
}
//# sourceMappingURL=FeatureGroup.d.ts.map