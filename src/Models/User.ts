import { Model, sutando } from "sutando";
import Feature from "./Feature";
import Ability from "./Ability";
import Usage from "./Usage";
import FeatureGroup from "./FeatureGroup";
import Consumption from "./Consumption";

let _prefix = ''

class User extends Model {
    declare id: number;
    declare email: string;
    declare created_at: Date;
    declare updated_at: Date;

    protected table: string = _prefix + 'users';
    static async migrate(prefix = '', skipOnExist = true) {
        _prefix = prefix;
        if (skipOnExist && await sutando.schema().hasTable(prefix + 'users')) {
            return;
        }

        await sutando.schema().createTable(prefix + 'users', table => {
            table.increments('id').primary();
            table.string('email').unique();
            table.timestamps();
        });

    }

    static firstOrCreate(email: string) {
        return User.query().firstOrCreate({ email: email });
    }

    relationAbilities() {
        return this.hasMany(Ability);
    }

    relationUsages() {
        return this.hasMany(Usage);
    }

    async grantFeature(feature: Feature | string, expire_at: Date, error_on_duplicate = true) {
        if (typeof feature === 'string') {
            feature = await Feature.findByName(feature);
        }
        // check date
        if (expire_at < new Date) {
            throw new Error('Invalid expire date');
        }

        switch (feature.type) {
            case 'ability':
                if (error_on_duplicate && await this.canTry(feature)) {
                    throw new Error('Feature is already granted');
                }
                // console.log((this as User).related('abilities'));
                const ability = await (this as User).related('abilities').create({
                    name: feature.name,
                    expired_at: expire_at,
                });
                // console.log(ability);
                return ability;
            case 'usage':
                if (!feature.quantity) {
                    throw new Error('Quantity is not defined in this feature');
                }
                return await (this as User).related('usages').create({
                    name: feature.name,
                    total: feature.quantity,
                    spend: 0,
                    expired_at: expire_at,
                })
        }
    }

    async revokeFeature(feature: Feature | string) {
        if (typeof feature === 'string') {
            feature = await Feature.findByName(feature);
        }

        switch (feature.type) {
            case 'ability':
                if (!await this.canTry(feature)) {
                    throw new Error('Feature is not found');
                }

                return await (this as User).related('abilities').where('name', feature.name).delete();

            case 'usage':
                return await (this as User).related('usages').where('name', feature.name).delete();
        }
    }

    async grantFeatureGroup(featureGroup: FeatureGroup | string, expire_at: Date, error_on_duplicate = true) {
        if (typeof featureGroup === 'string') {
            featureGroup = await FeatureGroup.findByName(featureGroup);
        }

        const features = await featureGroup.getRelated("features");

        for (const feature of features) {
            await this.grantFeature(feature, expire_at, error_on_duplicate);
        }

        return features;
    }

    async revokeFeatureGroup(featureGroup: FeatureGroup | string) {
        if (typeof featureGroup === 'string') {
            featureGroup = await FeatureGroup.findByName(featureGroup);
        }

        const features = await featureGroup.getRelated("features");

        for (const feature of features) {
            await this.revokeFeature(feature);
        }

        return true;
    }


    async try(feature: Feature | string, amount?: number, dry = false) {
        if (typeof feature === 'string') {
            feature = await Feature.findByName(feature);
        }
        const date = new Date;
        // trying feature
        switch (feature.type) {
            case 'ability':
                const ability = await (this as User).related('abilities').where('name', feature.name).where('expired_at', '>', date).first();
                return ability !== null;
            case 'usage':
                if (!amount) {
                    throw new Error('Please specify amount to consume usage');
                }
                const consumptions: Consumption[] = [];
                const usages = await (this as User).related('usages').where('name', feature.name).where('expired_at', '>', date).orderBy('expired_at', 'asc').get();
                if (usages.items.length === 0) {
                    if (dry) {
                        return false;
                    } else {
                        throw new Error('Usage not found');
                    }
                }

                // need to check if amount doesn't not exceed available spend.
                // example: if amount is 100 and there are two usages where both of spend is below 100, we shouldn't allow to consume the usage.
                let availableSpend = 0;
                for (const usage of usages) {
                    availableSpend += usage.total - usage.spend;
                }

                if (amount > availableSpend) {
                    if (dry) {
                        return false;
                    }
                    throw new Error(`Amount has exceeded available quota limit`);
                }

                if (dry) {
                    return true;
                }

                for (const usage of usages) {
                    if (amount < 1) {
                        break;
                    }

                    if (usage.total > usage.spend) {
                        const amountToSpend = Math.min(amount, usage.total - usage.spend);

                        consumptions.push(await usage.consume(amountToSpend));

                        amount -= amountToSpend;
                    }
                }

                return consumptions;
        }
    }

    async getAvailableFeatures(ability = true, usage = true, include_expire = false) {
        const date = new Date;
        const features = [];
        if (ability) {
            let query = await (this as User).related('abilities');

            if (!include_expire) {
                query = query.where('expired_at', '>', date);
            }
            const abilities = await query.pluck('name');
            abilities.each((name) => {
                features.push({
                    type: 'ability',
                    name: name
                })
            })
        }

        if (usage) {
            const usages: {
                [key: string]: number
            } = {};
            let query = await (this as User).related('usages');

            if (!include_expire) {
                query = query.where('expired_at', '>', date);
            }
            (await query.get()).each((usage) => {
                if (!usages[usage.name]) {
                    usages[usage.name] = usage.total - usage.spend;
                    return;
                }

                usages[usage.name] += usage.total - usage.spend;
            })

            for (let name of Object.keys(usages)) {
                features.push({
                    type: 'usage',
                    name: name,
                    balance: usages[name]
                })
            }
        }

        return features;
    }


    async canTry(feature: Feature | string, amount?: number) {
        return await this.try(feature, amount, true);
    }
}

export default User;