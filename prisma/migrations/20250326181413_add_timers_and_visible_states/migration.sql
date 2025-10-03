-- CreateTable
CREATE TABLE "visible_states" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "path" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "visible_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timers" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "path" TEXT NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "paused" BOOLEAN,
    "paused_at_seconds" INTEGER,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "timers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visible_states_event_id_path_key" ON "visible_states"("event_id", "path");

-- CreateIndex
CREATE UNIQUE INDEX "timers_event_id_path_key" ON "timers"("event_id", "path");

-- AddForeignKey
ALTER TABLE "visible_states" ADD CONSTRAINT "visible_states_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
