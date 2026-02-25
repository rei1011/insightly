-- CreateTable
CREATE TABLE "occupation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "occupation_pkey" PRIMARY KEY ("id")
);
