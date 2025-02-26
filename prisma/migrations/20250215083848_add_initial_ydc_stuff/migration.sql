-- CreateTable
CREATE TABLE "YDCOutput" (
    "id" SERIAL NOT NULL,
    "section_id" TEXT,
    "team_id" TEXT,

    CONSTRAINT "YDCOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YDCSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "YDCSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YDCTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "YDCTeam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "YDCOutput" ADD CONSTRAINT "YDCOutput_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "YDCSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YDCOutput" ADD CONSTRAINT "YDCOutput_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "YDCTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
