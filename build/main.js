"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_parser_readline = require("@serialport/parser-readline");
var import_date_fns = require("date-fns");
var import_serialport = require("serialport");
var import_types_and_consts = require("./lib/types-and-consts");
class BelgiumSmartMeterP1 extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "belgium-smart-meter-p1"
    });
    this.aggregateIntervals = 1;
    this.aggregateCounter = 0;
    this.discoveryReported = [];
    this.aggregation = {};
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    var _a, _b, _c;
    const port = (_a = this.config.serialPort) != null ? _a : "com1";
    const baudRate = (_b = this.config.baudrate) != null ? _b : 115200;
    this.aggregateIntervals = (_c = this.config.aggregateIntervals) != null ? _c : 10;
    this.aggregateCounter = 0;
    this.serialPort = new import_serialport.SerialPort({
      path: port,
      baudRate
    });
    this.log.info(`serial port: ${port} @ ${baudRate}`);
    const parser = this.serialPort.pipe(new import_parser_readline.ReadlineParser({ delimiter: "\r\n" }));
    parser.on("data", (line) => this.processLineFromSerialPort(line));
    await this.setObjectNotExistsAsync("testVariable", {
      type: "state",
      common: {
        name: "testVariable",
        type: "boolean",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    this.subscribeStates("testVariable");
    await this.setStateAsync("testVariable", true);
    await this.setStateAsync("testVariable", { val: true, ack: true });
    await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });
    let result = await this.checkPasswordAsync("admin", "iobroker");
    this.log.info("check user admin pw iobroker: " + result);
    result = await this.checkGroupAsync("admin", "admin");
    this.log.info("check group user admin group admin: " + result);
  }
  onUnload(callback) {
    var _a;
    try {
      (_a = this.serialPort) == null ? void 0 : _a.close();
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
  async processLineFromSerialPort(line) {
    if (line.startsWith("!")) {
      this.aggregateCounter++;
      return;
    }
    if (!line || line.startsWith("/FLU"))
      return;
    const code = line.split("(")[0];
    const parameter = import_types_and_consts.OBIS_TRANSLATION[code];
    if (!parameter) {
      this.log.warn(`unknown OBIS code ${code} - OBIS_TRANSLATION list must be extended`);
      return;
    }
    if (!parameter.name || parameter.type == "ignore" || !parameter.regex)
      return;
    const match = line.match(parameter.regex);
    if (!match) {
      this.log.error(`no regex match on "${line}" with ${parameter.regex}`);
      return;
    }
    const report = this.aggregateCounter === 0;
    let unit = "";
    switch (parameter.type) {
      case "realWithUnit":
        const rwu = this.parseRealWithUnit(match);
        unit = rwu.unit;
        if (report)
          this.log.debug(`${parameter.name} -> ${rwu.value} ${rwu.unit}`);
        break;
      case "tariff":
        const tariff = this.parseTariff(match);
        if (report)
          this.log.debug(`tariff -> ${import_types_and_consts.TariffEnum[tariff]}`);
        break;
      case "timestamp":
        const timestamp = this.parseTimestamp(match);
        if (report)
          this.log.debug(`timestamp ${(0, import_date_fns.format)(timestamp, "Ppp")}`);
        break;
      case "gas":
        const gas = this.parseGas(match);
        unit = gas.unit;
        if (report)
          this.log.debug(`gas ${gas.value} ${gas.unit} @ ${(0, import_date_fns.format)(gas.timestamp, "Ppp")}`);
        break;
      default:
        break;
    }
    if (parameter.stateRole && !this.discoveryReported.includes(parameter.name)) {
      await this.reportDiscoveredState(parameter, unit);
    }
    if (this.aggregateCounter === this.aggregateIntervals) {
      this.aggregateCounter = 0;
      this.log.debug(`=-=-=-=-=-= packet end =-=-=-=-=-=`);
    }
  }
  async reportDiscoveredState(parameter, unit) {
    var _a;
    const role = (_a = parameter.stateRole) == null ? void 0 : _a.split(".")[0];
    const name = parameter.name;
    this.log.info(`reporting ${name} as ${role}`);
    switch (role) {
      case "value":
        await this.setObjectNotExistsAsync(name, {
          type: "state",
          common: {
            name,
            type: "number",
            role: parameter.stateRole,
            unit,
            read: true,
            write: false
          },
          native: {}
        });
        break;
      default:
        break;
    }
    this.discoveryReported.push(name);
  }
  parseRealWithUnit(match) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    return { value, unit };
  }
  parseTariff(match) {
    return parseInt(match[1]);
  }
  parseTimestamp(match) {
    const capture = ("20" + match[1]).substring(0, 14);
    return (0, import_date_fns.parse)(capture, "yyyyMMddHHmmss", new Date());
  }
  parseGas(match) {
    const capture = ("20" + match[1]).substring(0, 14);
    const timestamp = (0, import_date_fns.parse)(capture, "yyyyMMddHHmmss", new Date());
    const value = parseFloat(match[2]);
    const unit = match[3];
    return { value, unit, timestamp };
  }
}
if (require.main !== module) {
  module.exports = (options) => new BelgiumSmartMeterP1(options);
} else {
  ;
  (() => new BelgiumSmartMeterP1())();
}
//# sourceMappingURL=main.js.map
