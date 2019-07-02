import uuid from 'uuid';
import { THING_TYPES } from './constants';

let instance = null;

class Store {
    constructor() {
        this.items = {};
        this.selected = {};
        instance = this;
    }

    get instance() {
        return instance;
    }

    getArray(ids = null) {
        if (!ids) {
            return Object.keys(this.items).map(id => this.items[id]);
        }
    }

    getObject(ids = null) {
        if (!ids) {
            return this.items;
        }
    }

    getAtCoordinates(x, y, aggregateSelection = false) {
        const match = this.getArray().find(thing => {
            const thingType = THING_TYPES[thing.type];
            const xMatch = x >= thing.x && x <= thing.x + thingType.width;
            const yMatch = y >= thing.y && y <= thing.y + thingType.height;
            return xMatch && yMatch;
        });

        if (match && aggregateSelection) {
            return {
                ...match,
                ...this.selected[match.id]
            };
        }

        return match;
    }

    getSelectionArray() {
        return Object.keys(this.selected).map(id => this.selected[id]);
    }

    add(things) {
        let thingMap = {};
        things.forEach(thing => {
            let id = uuid();
            thingMap[id] = {
                id,
                ...thing
            };
        });

        this.items = {
            ...this.items,
            ...thingMap
        };
    }

    update(thingsToUpdate) {
        thingsToUpdate.forEach(thingToUpdate => {
            const thing = this.items[thingToUpdate.id];
            this.items[thingToUpdate.id] = {
                ...thing,
                ...thingToUpdate
            };
        });
    }

    remove(ids) {}

    select(ids) {
        ids.forEach(id => {
            this.selected[id] = {
                id,
                selected: true
            };
        });
    }

    unselect(ids = null) {
        if (!ids) {
            this.selected = {};
            return;
        }

        ids.forEach(id => {
            this.selected[id] = undefined;
        });
    }
}

export default (window.store = new Store());
