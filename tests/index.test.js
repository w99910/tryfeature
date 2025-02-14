import { expect, test } from 'vitest'

import { sutando } from 'sutando';

import { User, Feature, FeatureGroup, Ability, Usage, Consumption } from '../src/index';
import { FeatureType } from '../src/Models/Feature';

import setup from './setup'
import basic from './basic'

sutando.addConnection({
    client: 'sqlite3',
    connection: {
        filename: ":memory:"
    },
    useNullAsDefault: true,
});

setup();
basic();