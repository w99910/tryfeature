import { Model, sutando } from "sutando";
import Feature from "./Feature";

let _prefix = ''

export default class FeatureGroup extends Model {
    id!: number;
    name!: string;
    description?: string;
    created_at!: Date;
    updated_at!: Date;

    protected table: string = _prefix + 'feature_groups';

    static async migrate(prefix = '', skipOnExist = true) {
        _prefix = prefix;

        if (!skipOnExist || !await sutando.schema().hasTable(prefix + 'feature_groups')) {
            await sutando.schema().createTable(prefix + 'feature_groups', table => {
                table.increments('id').primary();
                table.string('name').unique();
                table.text('description').nullable();
                table.timestamps();
            });
        }

        if (!skipOnExist || !await sutando.schema().hasTable(prefix + 'feature_groups_features')) {
            await sutando.schema().createTable(prefix + 'feature_groups_features', table => {
                table.increments('id').primary();
                table.bigInteger('feature_group_id').unsigned().references('id').inTable(prefix + 'feature_groups').onDelete('cascade');
                table.bigInteger('feature_id').unsigned().references('id').inTable(prefix + 'features').onDelete('cascade');
                table.timestamps();
            });
        }


    }

    relationFeatures() {
        return this.belongsToMany(Feature, _prefix + 'feature_groups_features', 'feature_id', 'feature_group_id').withTimestamps()
    }

    static async findByName(name: string) {
        const featureGroup = await FeatureGroup.query().where('name', name).first();

        if (!featureGroup) {
            throw new Error(`Feature Group ${name} not found`);
        }

        return featureGroup;
    }


    static firstOrCreate(name: string, description?: string) {
        return FeatureGroup.query().firstOrCreate({
            name: name,
        }, {
            description: description
        })
    }

    async addFeature(feature: Feature) {
        return await (this as FeatureGroup).related('features').attach(feature.id);
    }

    async removeFeature(feature: Feature) {
        return await (this as FeatureGroup).related('features').detach(feature.id);
    }

    async addFeatures(features: Feature[]) {
        for (const feature of features) {
            await this.addFeature(feature);
        }
    }

    async removeFeatures(features: Feature[]) {
        for (const feature of features) {
            await this.removeFeature(feature);
        }
    }



}