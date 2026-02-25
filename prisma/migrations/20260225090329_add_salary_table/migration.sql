-- CreateTable
CREATE TABLE "salary" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "occupation_id" UUID NOT NULL,
    "age" INTEGER NOT NULL,
    "grade" TEXT,
    "overtime_hours" DECIMAL(10,2),
    "annual_salary" DECIMAL(12,2) NOT NULL,
    "base_salary" DECIMAL(12,2) NOT NULL,
    "bonus" DECIMAL(12,2),
    "stock_options" DECIMAL(12,2),
    "rsu" DECIMAL(12,2),

    CONSTRAINT "salary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "salary" ADD CONSTRAINT "salary_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary" ADD CONSTRAINT "salary_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
