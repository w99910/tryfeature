import { expect, test } from 'vitest'
import { User, Feature, FeatureGroup, Ability, Usage, Consumption, FeatureType } from '../src/index.js';

export default function () {
    test('can grant and try ability typed feature', async () => {
        const user = await User.firstOrCreate('admin@test.com')

        await user.grantFeature('can-view', new Date((new Date).getTime() + 10000));
        expect(await user.canTry('can-view')).toBeTruthy();
    });

    test('can revoke ability typed feature', async () => {
        const user = await User.firstOrCreate('admin@test.com')

        await user.revokeFeature('can-view');

        expect(await user.canTry('can-view')).toBeFalsy();
    });

    test('can grant and try usage typed feature', async () => {
        const user = await User.firstOrCreate('admin@test.com')

        await user.grantFeature('api-call', new Date((new Date).getTime() + 10000));

        try {
            // need amount to try
            await user.try('api-call');
        } catch (e) {
            expect(e.message).toBe('Please specify amount to consume usage')
        }

        try {
            // cannot try exceeded amount
            await user.try('api-call', 101);
        } catch (e) {
            expect(e.message).toBe('Amount has exceeded available quota limit')
        }

        expect(await user.canTry('api-call', 100)).toBeTruthy();

        const consumptions = await user.try('api-call', 100);

        expect(consumptions[0].amount).toBe(100)

        try {
            // cannot try exceeded amount
            await user.try('api-call', 101);
        } catch (e) {
            expect(e.message).toBe('Amount has exceeded available quota limit')
        }
    });

    test('can revoke usage typed feature', async () => {
        const user = await User.firstOrCreate('admin@test.com')

        await user.revokeFeature('api-call');

        expect(await user.canTry('api-call', 100)).toBeFalsy();

        try {
            await user.try('api-call', 40);
        } catch (e) {
            expect(e.message).toBe('Usage not found')
        }
    });
}