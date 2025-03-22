import { Button } from "@mantine/core";
import {
  type ArrayPath,
  type FieldArray,
  type FieldValues,
  useFieldArray,
} from "react-hook-form";

export function ArrayField<
  TFieldValues extends FieldValues,
  TFieldName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
>(props: {
  name: string;
  children: (
    // The unknown here is to remind you that, because of coercion, some of the types may not be what you expect
    // (e.g. you have a field that's defined as `z.coerce.number()` - the final value will actually be a number,
    // but the value you'll get passed here may be a string
    field: Record<string, unknown> & { id: string },
    index: number,
    els: { remove: React.ReactNode },
  ) => React.ReactNode;
  newElement: (value: FieldArray<TFieldValues, TFieldName>[]) => TFieldValues;
  header?: React.ReactNode;
}) {
  const { fields, append, remove } = useFieldArray<TFieldValues, TFieldName>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    name: props.name as any /* TODO: the typings here are absolutely insane */,
  });
  return (
    <>
      {fields.length > 0 && props.header}
      {fields.map((field, idx) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
        props.children(field as any, idx, {
          remove: (
            <Button
              className="h-full min-w-[2rem] align-middle text-2xl font-black [&_.mantine-Button-inner]:text-xl"
              onClick={() => remove(idx)}
              variant="danger"
              size="sm"
            >
              x
            </Button>
          ),
        }),
      )}
      <Button
        className="mt-1 font-black md:col-span-3"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        onClick={() => append(props.newElement(fields) as any)}
        variant="outline"
        size="sm"
      >
        +
      </Button>
    </>
  );
}
