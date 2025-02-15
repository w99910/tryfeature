<div align="center">
  <img src="https://raw.githubusercontent.com/w99910/tryfeature/master/logo.svg" width="100" alt="TryFeature logo" />
  <h1 align="center">TryFeature</h1>
  <a href="https://www.npmjs.com/package/tryfeature"><img alt="NPM version" src="https://img.shields.io/npm/v/tryfeature.svg"></a>
  <a href="https://github.com/w99910/tryfeature/actions/workflows/test.yml"><img alt="ci" src="https://github.com/w99910/tryfeature/actions/workflows/test.yml/badge.svg"></a>
  <a href="https://github.com/w99910/tryfeature/blob/main/README.md"><img alt="GitHub" src="https://img.shields.io/bundlephobia/minzip/tryfeature"></a>
  <br />
</div>

![TryFeature](https://raw.githubusercontent.com/w99910/tryfeature/master/tryfeature.png)

TryFeature is an easy-to-use library for managing users and their associated features. It provides a simple, yet flexible API to handle both ability-typed features (e.g., permissions) and usage-typed features (e.g., quota-based actions). Use this library to easily migrate your data models, create users, define features, organize them into groups, and control feature grants, revocations, and consumption.

> TryFeature is inspired by Laravel package called [UseIt](https://github.com/w99910/use-it), and under the hood, [sutando](https://sutando.org/) is used to interact with database. 

## 📝 Table of Contents

- [Features](#-features)
- [How it works](#-how-it-works)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [License](#-license)
- [Support](#-show-your-support)

## ✨ Features

### Feature Management

- Create features with `Feature.firstOrCreate`.
- Support for two feature types:
  - **Ability-typed features**: Represent permissions or capabilities.
  - **Usage-typed features**: Represent quota-based actions (requires a specified quantity).
- Error handling for incorrect feature setup (e.g., missing quantity for usage features).


### Feature Grouping

- Create feature groups with `FeatureGroup.firstOrCreate`.
- Add and remove features from groups using `featureGroup.addFeatures` and `featureGroup.removeFeatures`.
- Grant all features of a feature group by name or object using `user.grantFeatureGroup`


### Granting/Revoking Feature Or Feature Group

- Grant feature using `user.grantFeature` or `user.grantFeatureGroup`
- Revoke feature using `user.revokeFeature` or `user.revokeFeatures`

### Usage Consumption

- Consume usage-based features with `user.try`.
- Track every consumption of an usage. 

### And more

- Include migrations for all core models such as User, Feature, Ability, FeatureGroup, Usage, and Consumption.
- Easy to extend


## 🤔 How it works

![Flowchart](https://raw.githubusercontent.com/w99910/tryfeature/master/flowchart.png)

## 🔌 Installation

```bash
npm i tryfeature
# or
pnpm i tryfeature
# or
yarn add tryfeature
```

## 👋 Getting started

- ### Migration

Before we get started, we need to migrate required tables first. 

  - **Connection**: Since [sutando](https://sutando.org/) is used under the hood, we need to setup database connection first. Please consult [its documentation page](https://sutando.org/guide/installation.html) for more details.

```js
// Example
import { sutando } from 'sutando';

sutando.addConnection({
    client: 'sqlite3',
    connection: {
        filename: ":memory:"
    },
    useNullAsDefault: true,
});
```

- **Migrate Tables**: In order to save time, you can use migration helper function `migrate` of each models. You can pass `prefix` for the table in case there is already existing table. 

```js
// set up connection
// ...
// migrate
const prefix = ''
await User.migrate(prefix);
await Feature.migrate(prefix);
await Ability.migrate(prefix);
await FeatureGroup.migrate(prefix);
await Usage.migrate(prefix);
await Consumption.migrate(prefix);
```

> By default, `migrate` function checks if there is already existing table. If exists, it skips the migraiton. Pass `false` as second parameter in `migrate` function such as 
```js
const skipOnExist = false;
await User.migrate('', skipOnExist)
```

- ### User Model

By default, User model has the following schema structure. In order to add more columns, please extend the model and add more columns in `migrate` function.

```js
table.increments('id').primary();
table.string('email').unique();
table.timestamps();
```

To create an user, you can use `User.firstOrCreate` async function. 

```js
import { User } from 'tryfeature';

const email = 'johndoe@example.com'

const user = await User.firstOrCreate(email);
```

- ### Feature Model

Schema structure:

```js
table.increments('id').primary();
table.string('name').unique();
table.enum('type', ['ability', 'usage']);
table.text('description').nullable();
table.bigInteger('quantity').nullable();
table.timestamps();
```

To create a feature, you can use `Feature.firstOrCreate`. It has four parameters.
```js
Feature.firstOrCreate(name: string, type: FeatureType, quantity?: number, description?: string)
``` 

```js
// Examples
import { Feature, FeatureType } from 'tryfeature';

const abilityFeature = await Feature.firstOrCreate('can-view', FeatureType.ability);

const usageFeature = await Feature.firstOrCreate('api-call', FeatureType.usage, 100);
```

- ### Feature Group Model

Feature and Feature Group has many-to-many relationship type. Schema structure:

```js
table.increments('id').primary();
table.string('name').unique();
table.text('description').nullable();
table.timestamps();
```

To create a feature group, you can use `FeatureGroup.firstOrCreate`. It has two parameters.
```js
FeatureGroup.firstOrCreate(name: string, description?: string)
``` 

```js
// Examples
import { FeatureGroup } from 'tryfeature';

const basicUser = await FeatureGroup.firstOrCreate('basic-user');
```

To add feature to feature group, you can use either `FeatureGroup.addFeature` or `FeatureGroup.addFeatures`. 

```js
import { Feature, FeatureGroup } from 'tryfeature';

const feature = await Feature.query().first();

await FeatureGroup.addFeature(feature);

await FeatureGroup.addFeatures([feature]);
```

To remove feature from feature group, use `FeatureGroup.removeFeature`. 

```js
import { Feature, FeatureGroup } from 'tryfeature';

const feature = await Feature.query().first();

await FeatureGroup.removeFeature(feature);
```

## 🔎 Usage

- ### Granting Feature

You can grant a user to a feature by passing feature name or feature object and expire date. 

```js
import { User } from 'tryfeature';

const user = await User.firstOrCreate('admin@test.com')

await user.grantFeature('can-view', new Date((new Date).getTime() + 10000));

await user.grantFeature('api-call', new Date((new Date).getTime() + 10000));
```

In order to grant a feature group, 

```js
import { User } from 'tryfeature';

await user.grantFeatureGroup('basic-user');
```

- ### Revoking Feature

Like granting feature, you can pass feature name or feature object. 

```js
import { User } from 'tryfeature';

const user = await User.firstOrCreate('admin@test.com')

await user.revokeFeature('can-view');

await user.revokeFeatureGroup('basic-user');
```

- ### Checking if you can try feature

Before you actually use feature, especially usage typed feature, you can check whether you can try feature. 

```js
import { User } from 'tryfeature';

const user = await User.firstOrCreate('admin@test.com')

await user.canTry('can-view'); // return boolean

await user.canTry('api-call', 10); // return boolean
```

> Please pass `amount` to be consumed as second parameter for usage typed feature. 

- ### Trying feature

  - Ability feature: Trying the feature returns `boolean`. 
  - Usage feature: Trying the feature returns an array of `Consumption` that are consumed. 

```js
import { User } from 'tryfeature';

const user = await User.firstOrCreate('admin@test.com')

await user.try('can-view'); // return boolean

await user.try('api-call', 10); // return boolean
```

When multiple usage entries exist, those expiring sooner will be prioritized for consumption.

## 📄 License

MIT

## 💖 Show Your Support

Please support me on [github](https://github.com/sponsors/w99910) if this project helped you.