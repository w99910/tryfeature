import { expect, test } from 'vitest'
import { User, Feature, FeatureGroup, Ability, Usage, Consumption, FeatureType } from '../src/index.js';
export default function () {
    test('can migrate', async () => {
        const prefix = ''
        await User.migrate(prefix);
        await Feature.migrate(prefix);
        await Ability.migrate(prefix);
        await FeatureGroup.migrate(prefix);
        await Usage.migrate(prefix);
        await Consumption.migrate(prefix);
    })

    test('can create user', async () => {
        const user = await User.firstOrCreate('admin@test.com')
        expect(user.email).toBe('admin@test.com')
    });

    test('can create features', async () => {
        const abilityFeature = await Feature.firstOrCreate('can-view', FeatureType.ability);
        expect(abilityFeature.type).toBe(FeatureType.ability);

        try {
            await Feature.firstOrCreate('api-call', FeatureType.usage);
        } catch (e) {
            // expect to throw error if quantity is not specified
            expect(e.message).toBe('Please specify quantity for usage-typed feature')
        }

        const usageFeature = await Feature.firstOrCreate('api-call', FeatureType.usage, 100);
        expect(usageFeature.type).toBe(FeatureType.usage);
    });

    test('can create feature group', async () => {
        const featureGroup = await FeatureGroup.firstOrCreate('creator-plan');
        expect(featureGroup.name).toBe('creator-plan');
    });

    test('can add/remove features', async () => {
        const featureGroup = await FeatureGroup.firstOrCreate('creator-plan');
        const features = await Feature.query().all();

        await featureGroup.addFeatures(features);

        await featureGroup.removeFeatures(features);
    })
}