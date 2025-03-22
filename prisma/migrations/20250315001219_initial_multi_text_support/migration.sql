-- CreateTable
CREATE TABLE "Layer" (
    "id" TEXT NOT NULL,
    "style" JSONB,

    CONSTRAINT "Layer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multi_texts" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "multi_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiTextSelected" (
    "multi_text_id" TEXT NOT NULL,
    "selected_option_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "multi_text_options" (
    "id" TEXT NOT NULL,
    "multi_text_id" TEXT NOT NULL,

    CONSTRAINT "multi_text_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "multi_texts_event_id_path_key" ON "multi_texts"("event_id", "path");

-- CreateIndex
CREATE UNIQUE INDEX "MultiTextSelected_multi_text_id_key" ON "MultiTextSelected"("multi_text_id");

-- AddForeignKey
ALTER TABLE "multi_texts" ADD CONSTRAINT "multi_texts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiTextSelected" ADD CONSTRAINT "MultiTextSelected_multi_text_id_fkey" FOREIGN KEY ("multi_text_id") REFERENCES "multi_texts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiTextSelected" ADD CONSTRAINT "MultiTextSelected_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "multi_text_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multi_text_options" ADD CONSTRAINT "multi_text_options_multi_text_id_fkey" FOREIGN KEY ("multi_text_id") REFERENCES "multi_texts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
