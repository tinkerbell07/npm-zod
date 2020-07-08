import * as z from './base';
import { ZodUndefined } from './undefined';
import { ZodNull } from './null';
import { ZodUnion } from './union';
import { ZodErrorCode } from '..';
// import { maskUtil } from '../helpers/maskUtil';
// import { zodmaskUtil } from '../helpers/zodmaskUtil';
// import { applyMask } from '../masker';

export interface ZodArrayDef<T extends z.ZodTypeAny = z.ZodTypeAny> extends z.ZodTypeDef {
  t: z.ZodTypes.array;
  type: T;
  nonempty: boolean;
}

export class ZodArray<T extends z.ZodTypeAny> extends z.ZodType<T['_type'][], ZodArrayDef<T>> {
  toJSON = () => {
    return {
      t: this._def.t,
      nonempty: this._def.nonempty,
      type: this._def.type.toJSON(),
    };
  };

  get element() {
    return this._def.type;
  }

  optional: () => ZodUnion<[this, ZodUndefined]> = () => ZodUnion.create([this, ZodUndefined.create()]);

  nullable: () => ZodUnion<[this, ZodNull]> = () => ZodUnion.create([this, ZodNull.create()]);

  min = (minLength: number, message?: string | { message?: string }) =>
    this._refinement({
      check: data => data.length >= minLength,
      code: ZodErrorCode.too_small,
      type: 'array',
      inclusive: true,
      minimum: minLength,
      ...(typeof message === 'string' ? { message } : message),
    });

  // this.refine(data => data.length >= minLength, msg || `Array must contain ${minLength} or more items.`);

  max = (maxLength: number, message?: string | { message?: string }) =>
    this._refinement({
      check: data => data.length <= maxLength,
      code: ZodErrorCode.too_big,
      type: 'array',
      inclusive: true,
      maximum: maxLength,
      ...(typeof message === 'string' ? { message } : message),
    });
  // this.refine(data => data.length <= maxLength, msg || `Array must contain ${maxLength} or fewer items.`);

  length = (len: number, message?: string) => this.min(len, { message }).max(len, { message });
  //  .refine(data => data.length === len, msg || `Array must contain ${len} items.`);

  nonempty: () => ZodNonEmptyArray<T> = () => {
    return new ZodNonEmptyArray({ ...this._def, nonempty: true });
  };

  // pick = <Mask extends zodmaskUtil.Params<T>>(mask: Mask): ZodArray<zodmaskUtil.pick<T, Mask>> => {
  //   return applyMask(this, mask, 'pick');
  // };

  // omit = <Mask extends zodmaskUtil.Params<T>>(mask: Mask): ZodArray<zodmaskUtil.omit<T, Mask>> => {
  //   return applyMask(this, mask, 'omit');
  // };

  static create = <T extends z.ZodTypeAny>(schema: T): ZodArray<T> => {
    return new ZodArray({
      t: z.ZodTypes.array,
      type: schema,
      nonempty: false,
    });
  };
}

export class ZodNonEmptyArray<T extends z.ZodTypeAny> extends z.ZodType<[T['_type'], ...T['_type'][]], ZodArrayDef<T>> {
  toJSON = () => {
    return {
      t: this._def.t,
      type: this._def.type.toJSON(),
    };
  };

  optional: () => ZodUnion<[this, ZodUndefined]> = () => ZodUnion.create([this, ZodUndefined.create()]);

  nullable: () => ZodUnion<[this, ZodNull]> = () => ZodUnion.create([this, ZodNull.create()]);

  min = (minLength: number, message?: string | { message?: string }) =>
    this._refinement({
      check: data => data.length >= minLength,
      code: ZodErrorCode.too_small,
      minimum: minLength,
      type: 'array',
      inclusive: true,
      ...(typeof message === 'string' ? { message } : message),
    });

  // this.refine(data => data.length >= minLength, msg || `Array must contain ${minLength} or more items.`);

  max = (maxLength: number, message?: string | { message?: string }) =>
    this._refinement({
      check: data => data.length >= maxLength,
      code: ZodErrorCode.too_big,
      maximum: maxLength,
      type: 'array',
      inclusive: true,
      ...(typeof message === 'string' ? { message } : message),
    });

  length = (len: number, message?: string) => this.min(len, { message }).max(len, { message });
  // static create = <T extends z.ZodTypeAny>(schema: T): ZodArray<T> => {
  //   return new ZodArray({
  //     t: z.ZodTypes.array,
  //     nonempty: true,
  //     type: schema,
  //   });
  // };
}
