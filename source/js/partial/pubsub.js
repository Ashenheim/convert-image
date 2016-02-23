/* ====================================
 * Event handler for modules
 * using the PubSub method.
 * -------------------------
 *
 *  Subscribe:
 *      events.on('eventName', function);
 *
 *  Unsubscribe:
 *      events.off('eventName', function);
 *
 *  Publish:
 *      events.emit('eventName', parameters);
 *
 * ==================================== */

'use strict';

var Events = {
    events: {},
    // Adds event to the list
    on: function(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
        return this;
    },
    // Removes event from the events list
    off: function(eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
        return this;
    },
    // Searched events list for function and executes it
    emit: function(eventName, data) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                this.events[eventName][0](data);
            }
        }
        return this;
    }
};

module.exports = Events;
