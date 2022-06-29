import schema, {ExtendedSchema, TYPE} from 'fluent-json-schema';
import {GeneralSchema, InferSchemaMap} from '../typings/CustomType';

export class Schema<T extends string> {
  private schemas: Record<T, GeneralSchema>;

  constructor(schemas: Record<T, GeneralSchema>) {
    this['schemas'] = schemas;

    return;
  }

  public getBaseSchema<T extends TYPE>(name: T): InferSchemaMap[T] {
    return schema[name]() as InferSchemaMap[T];
  }

  public getSchema(key: T): GeneralSchema {
    if (typeof this['schemas'][key] !== 'undefined') {
      return this['schemas'][key];
    } else {
      throw new Error("Parameter['key'] should be registered");
    }
  }

  public getObjectSchema<U extends T>(options: {
    requiredProperties?: U[];
    optionalProperties?: (U extends T ? Exclude<T, U> : T)[];
    extensions?: Record<Exclude<string, T>, GeneralSchema | ExtendedSchema>;
    isAdditionalPropertyAllowed?: boolean;
  }): ExtendedSchema {
    let objectSchema: InferSchemaMap['object'] = schema
      .object()
      .additionalProperties(
        typeof options['isAdditionalPropertyAllowed'] === 'boolean' &&
          options['isAdditionalPropertyAllowed'],
      );
    const properties: T[] = ([] as T[])
      .concat(options['requiredProperties'] || [])
      .concat(options['optionalProperties'] || []);
    const extensions: Exclude<string, T>[] = (
      typeof options['extensions'] === 'object'
        ? Object.keys(options['extensions'])
        : []
    ) as Exclude<string, T>[];

    for (let i: number = properties['length'] - 1; i != -1; i--) {
      objectSchema = objectSchema.prop(
        properties[i],
        this['schemas'][properties[i]],
      );
    }

    for (let i = 0; i < extensions['length']; i++) {
      objectSchema = objectSchema.prop(
        extensions[i],
        // @ts-expect-error Checked with array length
        options['extensions'][extensions[i]],
      );
    }

    if (Array.isArray(options['requiredProperties'])) {
      objectSchema = objectSchema.required(options['requiredProperties']);
    }

    return objectSchema.readOnly(true);
  }
}
