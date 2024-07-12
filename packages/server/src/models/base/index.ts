import { randomUUID } from "crypto";
import {
  Attributes,
  CreateOptions,
  FindOptions,
  Model,
  ModelStatic,
  Optional,
  ProjectionAlias,
} from "sequelize";
import { Col, Fn, Literal, MakeNullishOptional } from "sequelize/types/utils";
import BaseService from "../../services/base";
import { UpdateOptions } from "sequelize";
import {
  ExtraArrayFunctions,
  IExtraArrayFunctions,
  excludeUndefinedProps,
  IPureEntity,
} from "@kructzi-dart/universe";

export type BaseFindAttributeOptions<TAttributes> =
  | (Extract<keyof TAttributes, string> | ProjectionAlias)[]
  | {
      exclude: Extract<keyof TAttributes, string>[];
      include?: (Extract<keyof TAttributes, string> | ProjectionAlias)[];
    }
  | {
      exclude?: Extract<keyof TAttributes, string>[];
      include: (Extract<keyof TAttributes, string> | ProjectionAlias)[];
    };
export interface BaseFindOptions<TAttributes = object>
  extends FindOptions<TAttributes> {
  attributes?: BaseFindAttributeOptions<TAttributes>;
}

export interface NonNullBaseFindOptions<TAttributes = object>
  extends BaseFindOptions<TAttributes> {
  /**
   * Throw if nothing was found.
   */
  rejectOnEmpty: boolean | Error;
}

export type ResultType<M extends BaseModel<object>, TOption> = TOption extends
  | {
      attributes: (infer IncludedAttributes extends keyof Attributes<M>)[];
    }
  | {
      attributes: {
        include: (infer IncludedAttributes extends keyof Attributes<M>)[];
      };
    }
  ? Pick<Attributes<M>, IncludedAttributes>
  : TOption extends {
      attributes: {
        exclude: (infer IncludedAttributes extends keyof Attributes<M>)[];
      };
    }
  ? Omit<Attributes<M>, IncludedAttributes>
  : Attributes<M>;

export type BaseOptionalAttributes =
  | "createdBy"
  | "updatedBy"
  | "deletedAt"
  | "deletedBy";

export type BaseCreationAttributes<TAttributes extends object> =
  BaseOptionalAttributes extends keyof TAttributes
    ? Optional<TAttributes, BaseOptionalAttributes>
    : TAttributes;

export default class BaseModel<
  TModelAttributes extends object = object,
> extends Model<TModelAttributes> {
  public static async FindAll<
    M extends BaseModel<object>,
    TOption extends BaseFindOptions<Attributes<M>> | undefined,
  >(this: ModelStatic<M>, options?: TOption) {
    const result = (await this.findAll(options)).map((model) =>
      model.toJSON<ResultType<M, TOption>>(),
    );
    return Object.assign<typeof result, IExtraArrayFunctions>(
      result,
      ExtraArrayFunctions,
    );
  }

  // public static async FindOne<M extends BaseModel<object, object>>(
  //   this: ModelStatic<M>,
  //   options: NonNullBaseFindOptions<Attributes<M>>,
  // ): Promise<M>;
  // public static async FindOne<M extends BaseModel<object, object>>(
  //   this: ModelStatic<M>,
  //   options?: BaseFindOptions<Attributes<M>> | undefined,
  // ): Promise<M | null>;
  public static async FindOne<
    M extends BaseModel<object>,
    TOption extends
      | NonNullBaseFindOptions<Attributes<M>>
      | BaseFindOptions<Attributes<M>>
      | undefined,
  >(
    this: ModelStatic<M>,
    options?: TOption,
  ): Promise<ResultType<M, TOption> | null> {
    return (
      (await this.findOne(options))?.toJSON<ResultType<M, TOption>>() || null
    );
  }
  public static async Create<
    M extends BaseModel<object>,
    O extends CreateOptions<Attributes<M>> = CreateOptions<Attributes<M>>,
  >(
    this: ModelStatic<M>,
    values?:
      | MakeNullishOptional<IPureEntity<M["_creationAttributes"]>>
      | undefined,
    options?: O | undefined,
  ): Promise<
    O extends { returning: false } | { ignoreDuplicates: true } ? void : M
  > {
    const CurrentTime = new Date();
    const CurrentUserId = BaseService.CurrentUserID();
    const data = {
      id: randomUUID(),
      isActive: true,
      createdBy: CurrentUserId,
      createdAt: CurrentTime,
      updatedBy: CurrentUserId,
      updatedAt: CurrentTime,
      ...values,
    };
    return await this.create(
      data as unknown as MakeNullishOptional<M["_creationAttributes"]>,
      options,
    );
  }

  public static async Update<M extends BaseModel<object>>(
    this: ModelStatic<M>,
    values: {
      [key in keyof Attributes<M>]?:
        | Fn
        | Col
        | Literal
        | Attributes<M>[key]
        | undefined;
    },
    options: UpdateOptions<Attributes<M>>,
  ): Promise<[affectedCount: number]> {
    const CurrentTime = new Date();
    const CurrentUserId = BaseService.CurrentUserID();
    const data = {
      updatedBy: CurrentUserId,
      updatedAt: CurrentTime,
      ...excludeUndefinedProps(values),
    };
    return await this.update(data, options);
  }
}
