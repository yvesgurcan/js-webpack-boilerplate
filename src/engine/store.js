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

    getArray(ids = null, { aggregateType = false } = {}) {
        let things = [];
        if (!ids) {
            things = Object.keys(this.items).map(id => this.items[id]);
        } else {
            things = Object.keys(this.items)
                .map(id => this.items[id])
                .filter(thing => ids.includes(thing.id));
        }

        if (aggregateType) {
            return things.map(thing => ({
                ...thing,
                ...THING_TYPES[thing.type]
            }));
        }

        return things;
    }

    getObject(ids = null) {
        if (!ids) {
            return this.items;
        }
    }

    getAtCoordinates(x, y, { aggregateSelection = false } = {}) {
        const match = this.getArray().find(thing => {
            const thingType = THING_TYPES[thing.type];
            const xMatch = x >= thing.x && x < thing.x + thingType.width;
            const yMatch = y >= thing.y && y < thing.y + thingType.height;
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

    getSelectionArray({ aggregateThings = false } = {}) {
        let selected = Object.keys(this.selected).map(id => this.selected[id]);

        if (aggregateThings) {
            selected.map(thing => ({
                ...this.items[thing.id]
            }));
        }

        return selected;
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

    update(thingsToUpdate, { replace = false } = {}) {
        thingsToUpdate.forEach(thingToUpdate => {
            const thing = this.items[thingToUpdate.id];
            this.items[thingToUpdate.id] = {
                ...(!replace && { ...thing }),
                ...thingToUpdate
            };
        });
    }

    remove(ids) {
        ids.forEach(id => {
            delete this.items[id];
        });
    }

    select(ids) {
        ids.forEach(id => {
            this.selected[id] = {
                id
            };
        });
    }

    unselect(ids = null) {
        if (!ids) {
            this.selected = {};
            return;
        }

        ids.forEach(id => {
            delete this.selected[id];
        });
    }
}

export default (window.store = new Store());