import {
  ActionIcon,
  Button,
  Card,
  Group,
  Table,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  type ArrayPath,
  type FieldValues,
  useFieldArray,
} from "react-hook-form";
import { TextField } from "./text";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";

export function NamePathArrayField(props: { name: string; label?: string }) {
  interface TFieldValues extends FieldValues {
    name?: string;
    path?: string;
  }

  type TFieldName = ArrayPath<TFieldValues>;

  const { fields, append, remove } = useFieldArray<TFieldValues, TFieldName>({
    name: props.name,
  });

  const [arrayFieldInput, _setArrayFieldInput] = useState<{
    name: string;
    path: string;
  }>({ name: "", path: "" });
  const setArrayFieldInput = (
    data: Partial<{ name: string; path: string }>,
  ) => {
    _setArrayFieldInput((prev) => ({ ...prev, ...data }));
  };

  const inputRef = useRef<HTMLInputElement>(null);

  function updateFieldInput() {
    append(arrayFieldInput);
    setArrayFieldInput({ name: "", path: "" });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  return (
    <Card withBorder>
      {props.label && (
        <Title order={4} mb="md">
          {props.label}
        </Title>
      )}
      <Group>
        <TextInput
          label="Name"
          placeholder="Description"
          value={arrayFieldInput.name}
          onChange={(e) => setArrayFieldInput({ name: e.currentTarget.value })}
          ref={inputRef}
        />
        <TextInput
          label="Path"
          placeholder="description"
          value={arrayFieldInput.path}
          onChange={(e) => setArrayFieldInput({ path: e.currentTarget.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              updateFieldInput();
            }
          }}
        />
      </Group>
      <Group>
        <Button onClick={updateFieldInput} ml={"auto"}>
          Append
        </Button>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Path</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {fields.map((field, idx) => (
            <Table.Tr key={field.id}>
              <Table.Td>
                <TextField
                  name={`${props.name}.${idx}.name`}
                  key={`${props.name}.${idx}.name`}
                />
              </Table.Td>
              <Table.Td>
                <TextField
                  name={`${props.name}.${idx}.path`}
                  key={`${props.name}.${idx}.path`}
                />
              </Table.Td>
              <Table.Td>
                <Tooltip label="Remove">
                  <ActionIcon onClick={() => remove(idx)} color="red">
                    <FaTrash />
                  </ActionIcon>
                </Tooltip>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
