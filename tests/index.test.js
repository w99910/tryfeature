import { sutando } from 'sutando';

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