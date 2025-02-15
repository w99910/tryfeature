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



## 💖 Show Your Support

Please support me on [github](https://github.com/sponsors/w99910) if this project helped you