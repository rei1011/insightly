/*
  Warnings:

  - The primary key for the `company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `salary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `company_id` on the `salary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "salary" DROP CONSTRAINT "salary_company_id_fkey";

-- AlterTable
ALTER TABLE "company" DROP CONSTRAINT "company_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "company_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "salary" DROP CONSTRAINT "salary_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "company_id",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD CONSTRAINT "salary_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "salary" ADD CONSTRAINT "salary_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
