import { Model, sutando } from "sutando";
import FeatureGroup from "./FeatureGroup";


export enum FeatureType {
    ability = 'ability', usage = 'usage'
}

let _prefix = ''

export default class Feature extends Model {
    declare id: number;
    declare name: string;
    declare type: FeatureType;
    declare description?: string;
    declare quantity?: number;
    declare created_at: Date;
    declare updated_at: Date;

    protected table: string = _prefix + 'features';

    static async migrate(prefix = '', skipOnExist = true) {
        _prefix = prefix;

        if (skipOnExist && await sutando.schema().hasTable(prefix + 'features')) {
            return;
        }

        await sutando.schema().createTable(prefix + 'features', table => {
            table.increments('id').primary();
            table.string('name').unique();
            table.enum('type', [FeatureType.ability, FeatureType.usage]);
            table.text('description').nullable();
            table.bigInteger('quantity').nullable();
            table.timestamps();
        });
    }

    static async findByName(name: string) {
        const feature = await Feature.query().where('name', name).first();

        if (!feature) {
            throw new Error(`Feature ${name} not found`);
        }

        return feature;
    }

    static firstOrCreate(name: string, type: FeatureType, quantity?: number, description?: string) {
        if (type === 'usage' && !quantity) {
            throw new Error('Please specify quantity for usage-typed feature');
        }

        return Feature.query().firstOrCreate({
            name: name,
        }, {
            type: type,
            description: description ?? null,
            quantity: quantity ?? null
        })
    }

    relationFeatureGroups() {
        return this.belongsToMany(FeatureGroup, _prefix + 'feature_groups_features', 'feature_group_id', 'feature_id').withTimestamps()
    }
}