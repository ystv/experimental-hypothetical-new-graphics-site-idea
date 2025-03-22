import { TextInput } from "@mantine/core";
import { useFormContext } from "react-hook-form";

export function TextField(props: {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const ctx = useFormContext();
  return (
    <TextInput
      {...ctx.register(props.name)}
      label={props.label}
      error={ctx.formState.errors[props.name]?.message as string}
      placeholder={props.placeholder}
      withAsterisk={props.required}
    />
  );
}
