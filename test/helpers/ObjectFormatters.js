/* eslint camelcase: 0, no-invalid-this: 0 */

const util = require('util');

const { Card } = require('../../server/game/core/card/Card.js');
const Game = require('../../server/game/core/Game.js');
const Player = require('../../server/game/core/Player.js');

// Add custom toString methods for better Jasmine output
function formatObject(keys) {
    return function () {
        const formattedProperties = [];
        for (const key of keys) {
            const value = this[key];
            formattedProperties.push(`key:${util.inspect(value)}`);
        }
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

Card.prototype.toString = formatObject(['name', 'zone']);
Player.prototype.toString = formatObject(['name']);

Game.prototype.toString = function () {
    return 'Game';
};
