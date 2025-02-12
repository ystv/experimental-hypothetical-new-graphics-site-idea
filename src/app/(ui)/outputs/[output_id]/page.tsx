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
    createModalOpened,
    { close: closeCreateModal, open: openCreateModal },
  ] = useDisclosure();

  const [newQuestionText, setNewQuestionText] = useState("");

  const currentOutputQuestion = api.output.getCurrent.useQuery({
    output_id: params.output_id,
  });

  const questions = api.question.getAll.useQuery({
    output_id: params.output_id,
  });

  const createQuestion = api.question.create.useMutation();
  const deleteQuestion = api.question.delete.useMutation();

  const updateOutputSelection = api.output.selectQuestion.useMutation();

  const { socket } = useWebsocket();

  useEffect(() => {
    function onQuestionsUpdate() {
      questions
        .refetch()
        .catch(() => console.log("Failed to update questions"));
    }

    function onCurrentQuestionUpdate() {
      currentOutputQuestion
        .refetch()
        .catch(() => console.log("Failed to update current question"));
    }

    socket.on(`update:questions:${params.output_id}`, onQuestionsUpdate);
    socket.on(`update:output:${params.output_id}`, onCurrentQuestionUpdate);

    return () => {
      socket.off(`update:questions:${params.output_id}`, onQuestionsUpdate);
      socket.off(`update:output:${params.output_id}`, onCurrentQuestionUpdate);
    };
  });

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal}>
        <Textarea
          label="Question Text"
          value={newQuestionText}
          onChange={(event) => setNewQuestionText(event.currentTarget.value)}
        />
        <Button
          onClick={() => {
            createQuestion.mutate({
              text: newQuestionText,
              output_id: params.output_id,
            });
            closeCreateModal();
          }}
        >
          Add
        </Button>
      </Modal>
      <Stack>
        <Card>
          <Title>Current Question:</Title>
          {currentOutputQuestion.data == null ? (
            <>None selected</>
          ) : (
            <>{currentOutputQuestion.data.text}</>
          )}
        </Card>
        <Group>
          <Button onClick={openCreateModal}>Create</Button>
        </Group>
        {questions.data?.map((question) => {
          return (
            <Card key={question.id}>
              <Stack>
                <Text>{question.text}</Text>
                <Text c={"dimmed"} size="xs">
                  {question.order}
                </Text>
                <Group>
                  <Button
                    ml={"auto"}
                    color="green"
                    onClick={() => {
                      updateOutputSelection.mutate({
                        output_id: params.output_id,
                        question_id: question.id,
                      });
                    }}
                  >
                    Select
                  </Button>
                  <Button
                    color="red"
                    onClick={() => {
                      deleteQuestion.mutate({
                        output_id: params.output_id,
                        question_id: question.id,
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
