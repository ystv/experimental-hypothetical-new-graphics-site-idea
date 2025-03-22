import { NativeSelect } from "@mantine/core";
import { useFormContext } from "react-hook-form";

export function SelectField<TObj>(props: {
  name: string;
  options: TObj[];
  label?: string;
  renderOption: (obj: TObj) => string;
  getOptionValue: (obj: TObj) => string;
  filter: (obj: TObj, filter: string) => boolean;
  nullable?: boolean;
  required?: boolean;
}) {
  const ctx = useFormContext();
  const { name, label, options, getOptionValue, renderOption, nullable } =
    props;
  return (
    <NativeSelect
      {...ctx.register(name)}
      label={label}
      data={[
        ...(nullable ? [{ label: "None", value: "" }] : []),
        ...options.map((obj) => ({
          label: renderOption(obj),
          value: getOptionValue(obj),
        })),
      ]}
      required={props.required}
    />
  );
}
