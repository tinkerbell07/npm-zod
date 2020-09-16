import * as z from './base';
// import { ZodUnion } from './union';
// import { ZodUndefined } from './undefined';
// import { ZodNull } from './null';

export type OutputTypeOfTuple<
  T extends [z.ZodTypeAny, ...z.ZodTypeAny[]] | []
> = {
  [k in keyof T]: T[k] extends z.ZodType<any, any> ? T[k]['_output'] : never;
};

export type InputTypeOfTuple<
  T extends [z.ZodTypeAny, ...z.ZodTypeAny[]] | []
> = {
  [k in keyof T]: T[k] extends z.ZodType<any, any> ? T[k]['_input'] : never;
};

export interface ZodTupleDef<
  T extends [z.ZodTypeAny, ...z.ZodTypeAny[]] | [] = [
    z.ZodTypeAny,
    ...z.ZodTypeAny[],
  ]
> extends z.ZodTypeDef {
  t: z.ZodTypes.tuple;
  items: T;
}

export class ZodTuple<
  T extends [z.ZodTypeAny, ...z.ZodTypeAny[]] | [] = [
    z.ZodTypeAny,
    ...z.ZodTypeAny[],
  ]
> extends z.ZodType<OutputTypeOfTuple<T>, ZodTupleDef<T>, InputTypeOfTuple<T>> {
  toJSON = () => ({
    t: this._def.t,
    items: (this._def.items as any[]).map(item => item.toJSON()),
  });

  get items() {
    return this._def.items;
  }

  // opt optional: () => ZodUnion<[this, ZodUndefined]> = () => ZodUnion.create([this, ZodUndefined.create()]);

  // null nullable: () => ZodUnion<[this, ZodNull]> = () => ZodUnion.create([this, ZodNull.create()]);

  static create = <T extends [z.ZodTypeAny, ...z.ZodTypeAny[]] | []>(
    schemas: T,
  ): ZodTuple<T> => {
    return new ZodTuple({
      t: z.ZodTypes.tuple,
      items: schemas,
    });
  };
}
