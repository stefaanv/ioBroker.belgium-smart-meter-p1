const REAL_WITH_UNIT_REGEX = /[0-9\-:.]*\(([0-9.]*)\*(.*)\)/
const GAS_REGEX = /[0-9\-:.]*\(([0-9.]*).\)\(([0-9.]*)\*(.*)\)/
const INTEGER_REGEX = /[0-9\-:.]*\(([0-9]*)\)/
const STRING_REGEX = /[0-9\-:.]*\((.*)\)/
const TIMESTAMP_REGEX = /[0-9\-:.]*\(([0-9]*.)\)/
export type StateRole =
    | 'value.voltage'
    | 'value.current'
    | 'value.default'
    | 'value.power.consumption'
    | 'value.time'
    | 'info.name'
    | 'common.state'
export type ParameterNameAndType = {
    name?: string
    type: 'string' | 'timestamp' | 'tariff' | 'realWithUnit' | 'gas' | 'ignore'
    cumul?: 'last' | 'average'
    stateRole?: StateRole
    regex?: RegExp | null
}
export type ValueAndUnit = { value: number; unit: string }
export type ValueAndUnitAndTimestamp = ValueAndUnit & { timestamp: Date }
export enum TariffEnum {
    Peak = 1,
    OffPeak = 2,
}
export const OBIS_TRANSLATION: Record<string, ParameterNameAndType> = {
    '0-0:96.1.4': { name: 'meter-id', type: 'string', cumul: 'last', regex: STRING_REGEX, stateRole: 'info.name' },
    '0-0:96.1.1': { name: 'serial-number', type: 'string', cumul: 'last', regex: STRING_REGEX, stateRole: 'info.name' },
    '0-0:1.0.0': {
        name: 'timestamp',
        type: 'timestamp',
        cumul: 'last',
        regex: TIMESTAMP_REGEX,
        stateRole: 'value.time',
    },
    '1-0:1.8.1': {
        name: 'total-consumption-peak',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.power.consumption',
    },
    '1-0:1.8.2': {
        name: 'total-consumption-off-peak',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.power.consumption',
    },
    '1-0:2.8.1': {
        name: 'total-injection-peak',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.power.consumption',
    },
    '1-0:2.8.2': {
        name: 'total-injection-off-peak',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.power.consumption',
    },
    '0-0:96.14.0': { name: 'tariff', type: 'tariff', cumul: 'last', regex: INTEGER_REGEX, stateRole: 'common.state' },
    '1-0:1.7.0': {
        name: 'instantaneous-consumption-all-phases',
        type: 'realWithUnit',
        cumul: 'average',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'common.state',
    },
    '1-0:2.7.0': {
        name: 'instantaneous-injection-all-phases',
        type: 'realWithUnit',
        cumul: 'average',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'common.state',
    },
    '1-0:21.7.0': { type: 'ignore' },
    '1-0:41.7.0': { type: 'ignore' },
    '1-0:61.7.0': { type: 'ignore' },
    '1-0:22.7.0': { type: 'ignore' },
    '1-0:42.7.0': { type: 'ignore' },
    '1-0:62.7.0': { type: 'ignore' },
    '1-0:32.7.0': {
        name: 'l1-tension',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.voltage',
    },
    '1-0:52.7.0': {
        name: 'l2-tension',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.voltage',
    },
    '1-0:72.7.0': {
        name: 'l3-tension',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.voltage',
    },
    '1-0:31.7.0': {
        name: 'l1-current',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.current',
    },
    '1-0:51.7.0': {
        name: 'l2-current',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.current',
    },
    '1-0:71.7.0': {
        name: 'l2-current',
        type: 'realWithUnit',
        cumul: 'last',
        regex: REAL_WITH_UNIT_REGEX,
        stateRole: 'value.current',
    },
    '0-0:96.3.10': { type: 'ignore' },
    '0-0:17.0.0': { type: 'ignore' },
    '1-0:31.4.0': { type: 'ignore' },
    '0-0:96.13.0': { type: 'ignore' },
    '0-1:24.1.0': { type: 'ignore' },
    '0-1:96.1.1': { type: 'ignore' },
    '0-1:24.4.0': { type: 'ignore' },
    '0-1:24.2.3': { name: 'gas-total-consumption', type: 'gas', regex: GAS_REGEX, stateRole: 'common.state' }, //(221110152507W)(01515.254*m3)
}
