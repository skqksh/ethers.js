/**
 *  Most interactions with Ethereum requires integer values, which use
 *  the smallest magnitude unit.
 *
 *  For example, imagine dealing with dollars and cents. Since dollars
 *  are divisible, non-integer values are possible, such as ``$10.77``.
 *  By using the smallest indivisible unit (i.e. cents), the value can
 *  be kept as the integer ``1077``.
 *
 *  When receiving decimal input from the user (as a decimal string),
 *  the value should be converted to an integer and when showing a user
 *  a value, the integer value should be converted to a decimal string.
 *
 *  This creates a clear distinction, between values to be used by code
 *  (integers) and values used for display logic to users (decimals).
 *
 *  The native unit in Ethereum, //ether// is divisible to 18 decimal places,
 *  where each individual unit is called a //wei//.
 *
 *  @_subsection api/utils:Unit Conversion  [about-units]
 */
import { assertArgument } from "./errors.js";
import { FixedNumber } from "./fixednumber.js";
import { getNumber } from "./maths.js";

import type { BigNumberish, Numeric } from "../utils/index.js";

const unitNames = {
    'wei': 0,
    'kwei': 3,
    'mwei': 6,
    'gwei': 9,
    'szabo': 12,
    'finney': 15,
    'ether': 18,
} as const;
export type UnitNameType = keyof typeof unitNames;
export type UnitType = UnitNameType | Numeric;

/**
 *  Converts %%value%% into a //decimal string//, assuming %%unit%% decimal
 *  places. The %%unit%% may be the number of decimal places or the name of
 *  a unit (e.g. ``"gwei"`` for 9 decimal places).
 *
 */
export function formatUnits(value: BigNumberish, unit?: UnitType): string {
    let decimals = 18;
    if (typeof (unit) === "string") {
        assertArgument(unitNames[unit] >= 0, "invalid unit", "unit", unit);
        decimals = unitNames[unit];
    } else if (unit != null) {
        decimals = getNumber(unit, "unit");
    }

    return FixedNumber.fromValue(value, decimals, { decimals, width: 512 }).toString();
}

/**
 *  Converts the //decimal string// %%value%% to a BigInt, assuming
 *  %%unit%% decimal places. The %%unit%% may the number of decimal places
 *  or the name of a unit (e.g. ``"gwei"`` for 9 decimal places).
 */
export function parseUnits(value: string, unit?: UnitType): bigint {
    assertArgument(typeof (value) === "string", "value must be a string", "value", value);

    let decimals = 18;
    if (typeof (unit) === "string") {
        assertArgument(unitNames[unit] >= 0, "invalid unit", "unit", unit);
        decimals = unitNames[unit];
    } else if (unit != null) {
        decimals = getNumber(unit, "unit");
    }

    return FixedNumber.fromString(value, { decimals, width: 512 }).value;
}

/**
 *  Converts %%value%% into a //decimal string// using 18 decimal places.
 */
export function formatEther(wei: BigNumberish): string {
    return formatUnits(wei, 18);
}

/**
 *  Converts the //decimal string// %%ether%% to a BigInt, using 18
 *  decimal places.
 */
export function parseEther(ether: string): bigint {
    return parseUnits(ether, 18);
}
