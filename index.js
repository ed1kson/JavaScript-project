function isStringArray(arr) {
    if ( arr instanceof Array && arr.length > 0 && arr.every( function (item) {
        return typeof item === "string";
    })) {
        return true;
    } else {
        return false;
    }
}


//device
function Device(name, offOnLeave) {
    this.__id = Device.nextId++;
    this.__name = this.name(name);
    this.__isOn = false;
    this.__devices = [];
    this.__offOnLeave = offOnLeave;
}

Device.nextId = 0;

Device.prototype.getOffOnLeave = function () {
    return this.__offOnLeave;
}

Device.prototype.getId = function () {
    return this.__id;
}


Device.prototype.name = function (name) {
    if ( name !== undefined ) { 
        if ( typeof name === "string" ) {
            this.__name = name;
        } else {
            throw new TypeError("Parameter \"name\" must be a string")
        }
    } else {
        return this.__name;
    }
}

Device.prototype.isOn = function (val) {
    if ( val === undefined ) {
        return this.__isOn;
    }

    if ( typeof val === "boolean" ) {
        this.__isOn = val;
    } else {
        throw new TypeError("Parameter \"val\" must be a boolean")
    }
}

Device.prototype.addDevice = function (device) {
    if ( device instanceof Device ) {
        this.__devices.push(device)
    } else {
        var error = new TypeError("Only objects of type \"Device\" can be added")
        throw error;
    }
}

Device.prototype.getDevices = function (clazz) {
    if ( clazz === undefined ) {
        return this.__devices.slice();
    }

    var arr = [];
    for ( var i = 0 ; i < this.__devices.length ; i++ ) {
        var item = this.__devices[i];
        if ( item instanceof clazz ) {
            arr.push(item);
        }
    }

    return arr;
}

Device.prototype.getDevice = function (name) {
    if ( typeof name === "string" ) {
        name = name.toLowerCase();
    } else {
        throw new TypeError("Parameter \"name\" must be a string");
    }
    for (var i = 0 ; i < this.__devices.length ; i++ ) {
        if ( this.__devices[i].name().toLowerCase().indexOf(name) != -1 ) {
            return this.__devices[i];
        }
    }
}

Device.prototype.removeDevice = function (name) {
    if ( typeof name === "string" ) {
        name = name().toLowerCase();
    } else {
        throw new TypeError("Parameter \"name\" must be a string");
    }

    var result = [];

    for (var i = 0; i < this.__devices.length; i++) {
        if (this.__devices[i].name().toLowerCase().indexOf(name) === -1) {
            result.push(this.__devices[i]);
        }
    }

    this.__devices = result;
}

//tv
function Tv(name, remote) {
    Device.call(this, name, true);
    this.__volume = 1;
    this.__channels = ["National Geographic", "Nickelodeon", "Fox", "NBC"];
    this.__channel = 0;

    if ( remote !== undefined ) {
        if ( remote instanceof TvRemote ) {
            remote.tv(this);
        }
        this.addDevice(remote);
    }
}

Tv.prototype = Object.create(Device.prototype)
Tv.prototype.constructor = Tv;

Tv.prototype.info = function () {
    console.log(
        `--- Tv ${this.__name} ---
        channels: ${this.__channels}
        current channel: ${this.__channels[this.__channel]}
        volume: ${this.__volume * 100}%`
    )
}

Tv.prototype.volume = function (val) {
    if ( val === undefined ) {
        return this.__volume;
    }

    if ( typeof val === "number" ) {
        this.__volume = val;
    } else {
        throw new TypeError("Parameter \"val\" must be a number")
    }
}

Tv.prototype.channel = function (val) {
    if ( val === undefined ) {
        return this.__channel;
    }

    if ( typeof val === "number" && val % 1 === 0 ) {
        if ( val > this.__channels.length-1 || val < 0 ) {
            var error = new Error("number must be within the range of (0-" + this.__channels.length-1 + ")");
            error.name = "OutOfBoundsException";
            throw error;
        }
        this.__channel = val;
    } else {
        throw new TypeError("Parameter \"val\" must be an integer");
    }
}

Tv.prototype.getChannelName = function (id) {
    if ( id === undefined ) {
        throw new Error("Must include a parameter")
    }

    if ( typeof id === "number" && id % 1 === 0 ) {
        if ( id > this.__channels.length-1 || id < 0 ) {
            var error = new Error("number must be within the range of (0-" + this.__channels.length-1 + ")");
            error.name = "OutOfBoundsException";
            throw error;
        }
        return this.__channels[id];
    } else {
        throw new TypeError("Parameter \"val\" must be an integer");
    }
}

Tv.prototype.channels = function (channels) {
    if ( channels === undefined ) {
        return this.__channels.slice();
    }

    if ( isStringArray(channels) ) {
        this.__channels = channels
    } else {
        throw new TypeError("Parameter \"channels\" must be an array of strings");
    }
}

Tv.prototype.channelsInfo = function () {
    var res = "Channels: \n"
    for ( var i = 0 ; i < this.__channels.length ; i++ ) {
        var item = this.__channels[i];
        res += "\t" + (i) + ". " + item + "\n";
    }

    return res;
}

//remote
function TvRemote(name) {
    Device.call(this, name);
    this.__tv = undefined;
    this.__battery = 1;
}

TvRemote.prototype = Object.create(Device.prototype)
TvRemote.prototype.constructor = TvRemote;

TvRemote.prototype.info = function () {
    console.log(
        `--- TvRemote ${this.__name} ---
        Tv: ${this.__tv}`
    )
}

TvRemote.prototype.tv = function (tv) {
    if ( tv === undefined ) {
        return this.__tv;
    }

    if ( tv instanceof Tv ) {
        this.__tv = tv;
        this.__count = this.__tv.channels().length;
    } else {
        throw new TypeError("Parameter \"tv\" must be a Tv type object")
    }
}

TvRemote.prototype.OnOffTv  = function () {
    if ( this.tv() === undefined ) {
        console.log("no tv connected");
    }
    if ( this.__tv.isOn() ) {
        this.__tv.isOn(false);
        console.log("tv is off");
    } else {
        this.__tv.isOn(true);
        console.log("tv is on");
    }
}

TvRemote.prototype.volume = function (val) {
    if ( this.tv() === undefined ) {
        console.log("no tv connected");
    }
    if ( val === undefined ) {
        return this.__tv.volume();
    }

    if ( typeof val === "number" ) {
        this.__tv.volume(val)
    } else {
        throw new TypeError("Parameter \"val\" must be a number")
    }
}

TvRemote.prototype.channel = function (channel) {
    if ( this.tv() === undefined ) {
        console.log("no tv connected");
    }
    return this.tv().channel(channel);
}

TvRemote.prototype.nextChannel = function () {
    var current = this.tv().channel();
    this.tv().channel((current+1) % this.tv().channels().length);
}

TvRemote.prototype.prevChannel = function () {
    var nextChannel = this.tv().channel() - 1;
    if ( nextChannel === -1 ) nextChannel = this.tv().channels().length - 1;
    this.channel(nextChannel);
}

function Curtains(name) {
    Device.call(this, name);
    this.__open = true;
}

//curtains
Curtains.prototype = Object.create(Device.prototype);
Curtains.prototype.constructor = Curtains;

Curtains.prototype.open = function () {
    if ( this.__open ) {
        console.log("already open")
        return;
    }

    var self = this;
    console.log("Opening the curtains...");
    setTimeout(
        function () {
            self.__open = true;
            console.log("The curtains are opened!")
        },
        5000
    )
}

Curtains.prototype.close = function () {
    if ( !this.__open ) {
        console.log("already closed")
        return;
    }

    var self = this;
    console.log("Closing the curtains...");
    setTimeout(
        function () {
            self.__open = false;
            console.log("The curtains are closed!")
        },
        5000
    )
}

function Fridge(name) {
    Device.call(this, name, false);
    this.__t = 5;
}

Fridge.__maxT = 10;
Fridge.__minT = -20;

Fridge.prototype = Object.create(Device.prototype);
Fridge.prototype.constructor = Fridge;

Fridge.prototype.t = function (val) {
    if ( val === undefined ) {
        return this.__t;
    }

    if ( typeof val === "number" ) {
        if ( val < -20 || val > 10 ) {
            var error = new Error("Value must be within the range of " + Fridge.__minT + " to " + Fridge.__maxT);
            error.name = "OutOfBoundsException";
            throw error;
        }
        this.__t = val;
    } else {
        throw new TypeError("Parameter \"val\" must be a number")
    }
}

function SmartHouse(name) {
    Device.call(this, name)
}

SmartHouse.prototype = Object.create(Device.prototype);
SmartHouse.prototype.constructor = SmartHouse;

SmartHouse.prototype.leave = function () {
    var devices = this.getDevices();

    for (var i = 0 ; i < devices.length ; i++ ) {
        if ( devices[i].getOffOnLeave() ) {
            devices[i].isOn(false);
        }
    }
}