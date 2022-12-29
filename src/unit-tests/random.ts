import { SimpleChange, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export const randomString = (length = 5): string =>
  Array(length + 1)
    .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
    .slice(0, length);

export const randomEmail = () => `${randomString()}@example.com`;

export const randomBoolean = (): boolean =>
  Math.random().toString(2).substring(1) === '1';

export const randomNumber = (max: number = 10): number => Math.random() * max;

export const randomDateString = (
  start: Date = new Date(2000, 0, 1),
  end: Date = new Date(),
): string => {
  const randomDate = (): Date =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );

  return randomDate().toISOString();
};

export const mockArray = <T>(
  length: number,
  functionConstructor: () => T,
): T[] => Array.from({ length }, () => functionConstructor());

export const randomEnum = <T>(anEnum: T): T[keyof T] => {
  const keys = Object.keys(anEnum);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];
  // @ts-ignore
  return anEnum[randomKey];
};

export const randomElement = (elements: string[]): string => {
  const randomIndex = Math.floor(Math.random() * elements.length);
  return elements[randomIndex];
};

export const mockFormControl = <T>(
  functionConstructor: () => T,
): FormControl => {
  return new FormControl(functionConstructor());
};

export const mockFormGroup = <T>(functionConstructor: () => T): FormGroup => {
  const obj: { [key: string]: any } = functionConstructor();
  const controls = Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    acc[key] = new FormControl(value);
    return acc;
  }, {} as { [key: string]: FormControl });
  return new FormGroup(controls);
};

export const mockFormArray = <T>(
  length: number,
  base: (() => T) | T[],
): FormArray => {
  const formControls =
    typeof base === 'function'
      ? Array.from({ length }, () => new FormControl(base()))
      : base.map((element) =>
          typeof element === 'object'
            ? new FormGroup(
                Object.entries(element).reduce((acc, [key, value]) => {
                  acc[key] = new FormControl(value);
                  return acc;
                }, {} as { [key: string]: FormControl }),
              )
            : new FormControl(element),
        );
  return new FormArray(formControls);
};

export const mockSimpleChanges = (params: {
  [key: string]: any;
}): SimpleChanges => {
  const result = {} as SimpleChanges;
  for (const property in params) {
    if (params.hasOwnProperty(property)) {
      result[property] = new SimpleChange(undefined, params[property], true);
    }
  }
  return result;
};

export const getYesterday = (): Date => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};
