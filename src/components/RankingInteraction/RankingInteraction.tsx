"use client";

import { useState } from "react";
import { RankingTable } from "@/components/RankingTable/RankingTable";
import { SalaryDetailModal } from "@/components/SalaryDetailModal/SalaryDetailModal";
import type { RankingRecord } from "@/api/ranking";

type SelectedCompany = {
  id: number;
  name: string;
};

export type RankingInteractionProps = {
  data: RankingRecord[];
  occupationIds?: string[];
  ageFrom?: number;
  ageTo?: number;
};

export function RankingInteraction({
  data,
  occupationIds,
  ageFrom,
  ageTo,
}: RankingInteractionProps) {
  const [selectedCompany, setSelectedCompany] =
    useState<SelectedCompany | null>(null);

  return (
    <>
      <RankingTable
        data={data}
        onRowClick={(companyId, companyName) =>
          setSelectedCompany({ id: companyId, name: companyName })
        }
      />
      {selectedCompany && (
        <SalaryDetailModal
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
          occupationIds={occupationIds}
          ageFrom={ageFrom}
          ageTo={ageTo}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </>
  );
}
