
const colors = [
    "\x1b[31m",
    "\x1b[32m",
    "\x1b[33m",
    "\x1b[34m",
    "\x1b[35m",
    "\x1b[36m",
];

const colorWhite = "\x1b[37m";

class Logger {
    constructor(...zones) {
        this.zones = [...zones];
    }

    withZones(...zones) {
        return new Logger(...zones);
    }

    zone(name, callback) {
        this.startZone(name);

        callback();

        this.endZone(name);
    }

    startZone(name) {
        this.zones.push(name);
    }

    endZone(name) {
        const index = this.zones.indexOf(name);

        this.zones.splice(index, 1);
    }

    getCurrentZonesPrefix() {
        return this.zones.map((zone, index) => {
            index = index % colors.length;
            return `${colors[index]}[${zone}]`;
        }).join('');
    }

    log(text) {
        const zonesPrefix = this.getCurrentZonesPrefix();

        // console.log(`${zonesPrefix}: ${colorWhite}${text}`);
    }
}

export const logger = new Logger();