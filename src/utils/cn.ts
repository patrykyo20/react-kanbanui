type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassArray
  | ClassObject;
type ClassArray = ClassValue[];
type ClassObject = Record<string, boolean | null | undefined>;

/**
 * Enhanced className utility function
 * Combines multiple class values into a single string, filtering out falsy values
 * Supports strings, objects with boolean values, and arrays
 *
 * @param inputs - Class values to combine
 * @returns Combined className string
 */
export const cn = (...inputs: ClassValue[]): string => {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    const inputType = typeof input;

    if (inputType === "string" || inputType === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      if (input.length) {
        const innerResult = cn(...input);
        if (innerResult) {
          classes.push(innerResult);
        }
      }
    } else if (inputType === "object") {
      const obj = input as ClassObject;
      for (const [key, value] of Object.entries(obj)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
};
