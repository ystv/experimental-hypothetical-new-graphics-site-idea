import {
  ActionIcon,
  Button,
  Card,
  Group,
  Select,
  Space,
  Stack,
  Table,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  type ArrayPath,
  type FieldValues,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { TextField } from "./text";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {
  flattenRecord,
  getGraphicsCollections,
  GraphicsCollections,
  TGraphicsCollection,
  TGraphicsCollectionMappedPath,
  TGraphicsCollectionPath,
} from "@/lib/graphics";

export function GraphicsCollectionsField(props: {
  name: string;
  label?: string;
}) {
  interface TGraphicsCollectionField extends FieldValues {
    collectionSlug: keyof typeof GraphicsCollections;
    mapping: {
      multi_texts?: TGraphicsCollectionMappedPath[];
      timers?: TGraphicsCollectionMappedPath[];
      visible_states?: TGraphicsCollectionMappedPath[];
      societies?: TGraphicsCollectionMappedPath[];
    };
  }

  type TFieldName = ArrayPath<TGraphicsCollectionField>;

  const { fields, append, remove, update } = useFieldArray<
    TGraphicsCollectionField,
    TFieldName
  >({
    name: props.name,
  });

  const formContext = useFormContext();

  const [selectedCollection, setSelectedCollection] = useState<
    keyof typeof GraphicsCollections | null
  >(null);

  const collections = getGraphicsCollections();

  return (
    <Card withBorder>
      {props.label && (
        <Title order={4} mb="md">
          {props.label}
        </Title>
      )}
      <Stack>
        <Select
          label="Collection"
          data={collections.map((c) => {
            return { value: c.key, label: c.value.name };
          })}
          renderOption={({ option }) =>
            collections.find((v) => v.key === option.value)!.value.name
          }
          value={selectedCollection}
          onChange={(v) =>
            setSelectedCollection(v as keyof typeof GraphicsCollections)
          }
        />
        <Button
          onClick={() => {
            if (selectedCollection === null) return;
            const collection = GraphicsCollections[selectedCollection];
            append({
              collectionSlug: selectedCollection,
              mapping: setMappedPathsDefault(collection.data),
            });
          }}
          disabled={selectedCollection === null}
        >
          Add to Event
        </Button>
        {fields.map((field, fieldIdx) => {
          const fieldValues = formContext.getValues(
            `${props.name}.${fieldIdx}`,
          ) as TGraphicsCollectionField;
          const collection = GraphicsCollections[fieldValues.collectionSlug];
          return (
            <Card withBorder key={field.id}>
              <Group>
                <Title order={4}>{collection.name}</Title>
                <ActionIcon
                  onClick={() => {
                    remove(fieldIdx);
                  }}
                  color={"red"}
                  ml={"auto"}
                >
                  <FaTrash />
                </ActionIcon>
              </Group>
              <Space h="md" />
              <Title order={5}>Multi Texts</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Internal Path</Table.Th>
                    <Table.Th>Mapped Path</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {flattenRecord(collection.data.multi_texts).map(
                    (multi_text) => {
                      return (
                        <Table.Tr key={multi_text.key}>
                          <Table.Td>{multi_text.value.name}</Table.Td>
                          <Table.Td>{multi_text.key}</Table.Td>
                          <Table.Td>
                            <TextField
                              required
                              name={`${props.name}.${fieldIdx}.mapping.multi_texts.${multi_text.key}.mapped_path`}
                            />
                          </Table.Td>
                        </Table.Tr>
                      );
                    },
                  )}
                </Table.Tbody>
              </Table>
              <Space h="md" />
              <Title order={5}>Timers</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Internal Path</Table.Th>
                    <Table.Th>Mapped Path</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {flattenRecord(collection.data.timers).map((timer) => {
                    return (
                      <Table.Tr key={timer.key}>
                        <Table.Td>{timer.value.name}</Table.Td>
                        <Table.Td>{timer.key}</Table.Td>
                        <Table.Td>
                          <TextField
                            required
                            name={`${props.name}.${fieldIdx}.mapping.timers.${timer.key}.mapped_path`}
                          />
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
              <Space h="md" />
              <Title order={5}>Visible States</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Internal Path</Table.Th>
                    <Table.Th>Mapped Path</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {flattenRecord(collection.data.visible_states).map(
                    (visible_state) => {
                      return (
                        <Table.Tr key={visible_state.key}>
                          <Table.Td>{visible_state.value.name}</Table.Td>
                          <Table.Td>{visible_state.key}</Table.Td>
                          <Table.Td>
                            <TextField
                              required
                              name={`${props.name}.${fieldIdx}.mapping.visible_states.${visible_state.key}.mapped_path`}
                            />
                          </Table.Td>
                        </Table.Tr>
                      );
                    },
                  )}
                </Table.Tbody>
              </Table>
              <Space h="md" />
              <Title order={5}>Societies</Title>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Internal Path</Table.Th>
                    <Table.Th>Mapped Path</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {flattenRecord(collection.data.societies).map((society) => {
                    return (
                      <Table.Tr key={society.key}>
                        <Table.Td>{society.value.name}</Table.Td>
                        <Table.Td>{society.key}</Table.Td>
                        <Table.Td>
                          <TextField
                            required
                            name={`${props.name}.${fieldIdx}.mapping.societies.${society.key}.mapped_path`}
                          />
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Card>
          );
        })}
      </Stack>
      {/* <Group>
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
      </Table> */}
    </Card>
  );
}

function setMappedPathsDefault(
  mapping: Record<string, Record<string, TGraphicsCollectionPath>>,
): Record<string, Record<string, TGraphicsCollectionMappedPath>> {
  return Object.fromEntries(
    Object.entries(mapping).map(([k, v]) => [
      k,
      Object.fromEntries(
        Object.entries(v).map(([k, v]) => [k, { ...v, mapped_path: k }]),
      ),
    ]),
  );
}
