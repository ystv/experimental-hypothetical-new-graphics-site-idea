import {
  type DeepPartial,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { type z, type ZodEffects, type ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useTransition } from "react";
import { Button, type DefaultMantineColor } from "@mantine/core";

export * from "./form-fields/array";
export * from "./form-fields/select";
export * from "./form-fields/text";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormErrorResponse<Fields extends FieldValues = any> {
  ok: false;
  errors: Partial<Record<keyof Fields | "root", string>>;
}

export type FormResponse<
  OK extends Record<string, unknown> = never,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Fields extends FieldValues = any,
> = ({ ok: true } & { data: OK }) | FormErrorResponse<Fields>;
export type FormAction<
  OK extends Record<string, unknown> = never,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Fields extends FieldValues = any,
> = (data: Fields) => Promise<FormResponse<OK, Fields>>;

export function Form<
  Schema extends ZodTypeAny | ZodEffects<ZodTypeAny>,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  SuccessfulResponse extends Record<string, unknown> = {},
>(props: {
  schema: Schema;
  initialValues?: DeepPartial<z.infer<Schema>>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  submitColor?: DefaultMantineColor;
  action: FormAction<SuccessfulResponse, z.infer<Schema>>;
  onSuccess?: (res: SuccessfulResponse) => void;
}) {
  const form = useForm<z.infer<Schema>>({
    resolver: zodResolver(props.schema),
    defaultValues: props.initialValues,
  });

  const [isSubmitting, startSubmitting] = useTransition();
  const { action, onSuccess } = props;
  const submitHandler = useCallback(async () => {
    const valid = await form.trigger();
    if (valid) {
      startSubmitting(async () => {
        let res;
        try {
          res = await action(form.getValues());
        } catch (e) {
          console.error(e);
          form.setError("root", { type: "custom", message: String(e) });
          return;
        }
        if (!("ok" in res)) {
          throw new Error(
            "<Form> action did not conform to FormResponse interface",
          );
        }
        if (res.ok) {
          form.clearErrors();
          onSuccess?.(res.data);
          return;
        }
        form.clearErrors();
        for (const [k, err] of Object.entries(
          (res as FormErrorResponse).errors,
        )) {
          form.setError(k as FieldPath<z.infer<Schema>>, {
            type: "custom",
            message: err,
          });
        }
      });
    }
  }, [form, action, onSuccess]);

  return (
    <FormProvider {...form}>
      <form action={submitHandler} className={props.className}>
        {form.formState.errors.root && (
          <span className="block font-semibold text-red-500">
            {form.formState.errors.root?.message ?? ""}
          </span>
        )}
        {props.children}
        <br />
        <div className="text-right">
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            loading={isSubmitting}
            color={props.submitColor}
          >
            {props.submitLabel ?? "Submit"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
