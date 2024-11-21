
import SearchCompare from "../ui/compare/compare";

export default async function ComparePlayers() { 

  return (
    <div className="mt-6">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SearchCompare />
                <SearchCompare />
            </div>
        </div>
      </main>
    </div>
  );
}
