"use client";

import { api } from "@/trpc/react";
import {
  Avatar,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import SocietyStateWrapper from "./graphics/society-data-wrapper";
import { FaCheck } from "react-icons/fa";

export function SocietyControl(props: { event_id: string; path: string }) {
  const societyQuery = api.societies.readPath.useQuery({
    event_id: props.event_id,
    path: props.path,
  });

  const [
    selectModalOpened,
    { open: openSelectModal, close: closeSelectModal },
  ] = useDisclosure(false);

  return (
    <Card withBorder>
      {societyQuery.data ? (
        <SocietyStateWrapper event_id={props.event_id} path={props.path}>
          {(state) => (
            <Stack>
              <Group>
                <Text>{societyQuery.data?.dbSociety.name}</Text>
                <Text c="dimmed">{societyQuery.data?.dbSociety.path}</Text>
              </Group>
              {state?.societyData ? (
                <>
                  <Divider />
                  <Group>
                    {state.societyData.thumbnail_url ? (
                      <Image
                        src={state.societyData.thumbnail_url}
                        alt="Society Logo"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <Avatar name={state.societyData.name} w={48} h={48} />
                    )}
                    <Stack gap={0}>
                      <Text>{state.societyData.name}</Text>
                      <Text c="dimmed">
                        {state.societyData.instagram !== ""
                          ? "@" + state.societyData.instagram
                          : state.societyData.email_address}
                      </Text>
                    </Stack>
                  </Group>
                  <Divider />
                </>
              ) : (
                <>No Society Selected</>
              )}
              <Button ml={"auto"} onClick={openSelectModal}>
                Select Society
              </Button>
            </Stack>
          )}
        </SocietyStateWrapper>
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
      <SocietySelectModal
        opened={selectModalOpened}
        onClose={closeSelectModal}
        selectedSocietyId={societyQuery.data?.societyData?.group_id}
        event_id={props.event_id}
        path={props.path}
      />
    </Card>
  );
}

function SocietySelectModal(props: {
  opened: boolean;
  onClose: () => void;
  selectedSocietyId?: number;
  event_id: string;
  path: string;
}) {
  const selectSociety = api.societies.select.useMutation().mutateAsync;

  const [searchTerm, setSearchTerm] = useDebouncedState<string>("", 500);

  const searchQuery = api.societies.list.useQuery(
    { searchTerm: searchTerm, perPage: 10, page: 1 },
    { enabled: props.opened },
  );

  return (
    <Modal opened={props.opened} onClose={props.onClose} size={"lg"}>
      <Stack>
        <Title order={3}>Select a Society</Title>
        <TextInput
          label="Search"
          placeholder="Search for a society"
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
        {searchQuery.isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          searchQuery.data && (
            <Stack>
              {searchQuery.data.data.length === 0 && (
                <Text>No societies found</Text>
              )}
              {searchQuery.data.data.map((society) => (
                <Card key={society.id} withBorder>
                  <Group>
                    {society.thumbnail_url ? (
                      <Image
                        src={society.thumbnail_url}
                        alt={society.name}
                        width={48}
                        height={48}
                      />
                    ) : (
                      <Avatar name={society.name} w={48} h={48} />
                    )}
                    <Stack>
                      <Text>{society.name}</Text>
                    </Stack>
                    <Button
                      ml={"auto"}
                      disabled={props.selectedSocietyId === society.id}
                      leftSection={
                        props.selectedSocietyId === society.id ? (
                          <FaCheck />
                        ) : (
                          <></>
                        )
                      }
                      onClick={async () => {
                        await selectSociety({
                          group_id: society.id,
                          event_id: props.event_id,
                          path: props.path,
                        });
                        props.onClose();
                      }}
                    >
                      Select
                    </Button>
                  </Group>
                </Card>
              ))}
            </Stack>
          )
        )}
      </Stack>
    </Modal>
  );
}
