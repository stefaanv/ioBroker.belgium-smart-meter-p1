"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var types_and_consts_exports = {};
__export(types_and_consts_exports, {
  OBIS_TRANSLATION: () => OBIS_TRANSLATION,
  TariffEnum: () => TariffEnum
});
module.exports = __toCommonJS(types_and_consts_exports);
const REAL_WITH_UNIT_REGEX = /[0-9\-:.]*\(([0-9.]*)\*(.*)\)/;
const GAS_REGEX = /[0-9\-:.]*\(([0-9.]*).\)\(([0-9.]*)\*(.*)\)/;
const INTEGER_REGEX = /[0-9\-:.]*\(([0-9]*)\)/;
const STRING_REGEX = /[0-9\-:.]*\((.*)\)/;
const TIMESTAMP_REGEX = /[0-9\-:.]*\(([0-9]*.)\)/;
var TariffEnum = /* @__PURE__ */ ((TariffEnum2) => {
  TariffEnum2[TariffEnum2["Peak"] = 1] = "Peak";
  TariffEnum2[TariffEnum2["OffPeak"] = 2] = "OffPeak";
  return TariffEnum2;
})(TariffEnum || {});
const OBIS_TRANSLATION = {
  "0-0:96.1.4": { name: "meter-id", type: "string", cumul: "last", regex: STRING_REGEX, stateRole: "info.name" },
  "0-0:96.1.1": { name: "serial-number", type: "string", cumul: "last", regex: STRING_REGEX, stateRole: "info.name" },
  "0-0:1.0.0": {
    name: "timestamp",
    type: "timestamp",
    cumul: "last",
    regex: TIMESTAMP_REGEX,
    stateRole: "value.time"
  },
  "1-0:1.8.1": {
    name: "total-consumption-peak",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.power.consumption"
  },
  "1-0:1.8.2": {
    name: "total-consumption-off-peak",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.power.consumption"
  },
  "1-0:2.8.1": {
    name: "total-injection-peak",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.power.consumption"
  },
  "1-0:2.8.2": {
    name: "total-injection-off-peak",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.power.consumption"
  },
  "0-0:96.14.0": { name: "tariff", type: "tariff", cumul: "last", regex: INTEGER_REGEX, stateRole: "common.state" },
  "1-0:1.7.0": {
    name: "instantaneous-consumption-all-phases",
    type: "realWithUnit",
    cumul: "average",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "common.state"
  },
  "1-0:2.7.0": {
    name: "instantaneous-injection-all-phases",
    type: "realWithUnit",
    cumul: "average",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "common.state"
  },
  "1-0:21.7.0": { type: "ignore" },
  "1-0:41.7.0": { type: "ignore" },
  "1-0:61.7.0": { type: "ignore" },
  "1-0:22.7.0": { type: "ignore" },
  "1-0:42.7.0": { type: "ignore" },
  "1-0:62.7.0": { type: "ignore" },
  "1-0:32.7.0": {
    name: "l1-tension",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.voltage"
  },
  "1-0:52.7.0": {
    name: "l2-tension",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.voltage"
  },
  "1-0:72.7.0": {
    name: "l3-tension",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.voltage"
  },
  "1-0:31.7.0": {
    name: "l1-current",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.current"
  },
  "1-0:51.7.0": {
    name: "l2-current",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.current"
  },
  "1-0:71.7.0": {
    name: "l2-current",
    type: "realWithUnit",
    cumul: "last",
    regex: REAL_WITH_UNIT_REGEX,
    stateRole: "value.current"
  },
  "0-0:96.3.10": { type: "ignore" },
  "0-0:17.0.0": { type: "ignore" },
  "1-0:31.4.0": { type: "ignore" },
  "0-0:96.13.0": { type: "ignore" },
  "0-1:24.1.0": { type: "ignore" },
  "0-1:96.1.1": { type: "ignore" },
  "0-1:24.4.0": { type: "ignore" },
  "0-1:24.2.3": { name: "gas-total-consumption", type: "gas", regex: GAS_REGEX, stateRole: "common.state" }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OBIS_TRANSLATION,
  TariffEnum
});
//# sourceMappingURL=types-and-consts.js.map
