"use client";

import { useWebsocket } from "@/app/_components/websocket-provider";
import { api } from "@/trpc/react";
import {
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function OutputIDPage() {
  const params = z.object({ output_id: z.coerce.number() }).parse(useParams());

  const [
    createTeamModalOpened,
    { close: closeTeamCreateModal, open: openTeamCreateModal },
  ] = useDisclosure();

  const [
    createSectionModalOpened,
    { close: closeSectionCreateModal, open: openSectionCreateModal },
  ] = useDisclosure();

  const [newTeamText, setNewTeamText] = useState("");
  const [newSectionText, setNewSectionText] = useState("");

  const currentOutput = api.ydc.output.getCurrent.useQuery({
    output_id: params.output_id,
  });

  const teams = api.ydc.team.getAll.useQuery();

  const sections = api.ydc.section.getAll.useQuery();

  const createTeam = api.ydc.team.create.useMutation();
  const deleteTeam = api.ydc.team.delete.useMutation();

  const createSection = api.ydc.section.create.useMutation();
  const deleteSection = api.ydc.section.delete.useMutation();

  const updateOutputSelection = api.ydc.output.updateOutput.useMutation();

  const { socket } = useWebsocket();

  useEffect(() => {
    function onTeamsUpdate() {
      teams.refetch().catch(() => console.log("Failed to update questions"));
    }

    function onSectionsUpdate() {
      sections.refetch().catch(() => console.log("Failed to update questions"));
    }

    function onOutputUpdate() {
      currentOutput
        .refetch()
        .catch(() => console.log("Failed to update current question"));
    }

    socket.on(`update:ydc:teams`, onTeamsUpdate);
    socket.on(`update:ydc:sections`, onSectionsUpdate);
    socket.on(`update:ydc:output:${params.output_id}`, onOutputUpdate);

    return () => {
      socket.off(`update:ydc:teams`, onTeamsUpdate);
      socket.off(`update:ydc:sections`, onSectionsUpdate);
      socket.off(`update:ydc:output:${params.output_id}`, onOutputUpdate);
    };
  });

  return (
    <>
      <Modal opened={createTeamModalOpened} onClose={closeTeamCreateModal}>
        <Textarea
          label="Team Name"
          value={newTeamText}
          onChange={(event) => setNewTeamText(event.currentTarget.value)}
        />
        <Button
          onClick={() => {
            createTeam.mutate({
              text: newTeamText,
            });
            closeTeamCreateModal();
          }}
        >
          Add
        </Button>
      </Modal>
      <Modal
        opened={createSectionModalOpened}
        onClose={closeSectionCreateModal}
      >
        <Textarea
          label="Section Name"
          value={newSectionText}
          onChange={(event) => setNewSectionText(event.currentTarget.value)}
        />
        <Button
          onClick={() => {
            createSection.mutate({
              text: newSectionText,
            });
            closeSectionCreateModal();
          }}
        >
          Add
        </Button>
      </Modal>
      <Stack>
        <Card>
          <Title>Current Output:</Title>
          {currentOutput.data == null ? (
            <>None selected</>
          ) : (
            <Stack>
              <Text>Section: {currentOutput.data.section?.name}</Text>
              <Text>Name: {currentOutput.data.team?.name}</Text>
            </Stack>
          )}
        </Card>
        <Group>
          <Button onClick={openTeamCreateModal}>Create Team</Button>
          <Button onClick={openSectionCreateModal}>Create Section</Button>
        </Group>
        <Title>Teams:</Title>
        {teams.data?.map((team) => {
          const isSelected = currentOutput.data?.team?.id == team.id;
          return (
            <Card key={team.id}>
              <Stack>
                <Group>
                  <Text>{team.name}</Text>
                  <Button
                    ml={"auto"}
                    color="green"
                    disabled={isSelected}
                    onClick={() => {
                      updateOutputSelection.mutate({
                        output_id: params.output_id,
                        team_id: team.id,
                      });
                    }}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>
                  <Button
                    color="red"
                    onClick={() => {
                      deleteTeam.mutate({
                        team_id: team.id,
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Group>
              </Stack>
            </Card>
          );
        })}
        <Title>Sections:</Title>
        {sections.data?.map((section) => {
          const isSelected = currentOutput.data?.section?.id == section.id;
          return (
            <Card key={section.id}>
              <Stack>
                <Group>
                  <Text>{section.name}</Text>
                  <Button
                    ml={"auto"}
                    color="green"
                    disabled={isSelected}
                    onClick={() => {
                      updateOutputSelection.mutate({
                        output_id: params.output_id,
                        section_id: section.id,
                      });
                    }}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>
                  <Button
                    color="red"
                    onClick={() => {
                      deleteSection.mutate({
                        section_id: section.id,
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Group>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
