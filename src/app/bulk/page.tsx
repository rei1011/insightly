import { BulkUpload } from '@/components/BulkUpload/BulkUpload';

export default function BulkPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-16 px-8 bg-white dark:bg-black sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          一括操作
        </h1>
        <BulkUpload />
      </main>
    </div>
  );
}
