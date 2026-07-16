export function RecommendedSuppliers() {
  return (
    <section className="rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-semibold text-[#1E1E1E]">
        Recommended Suppliers
      </h2>
      <p className="text-sm text-[#6B6B6B]">
        Matched to your buying patterns.
      </p>

      <div className="mt-4 rounded-md border border-dashed border-[#D8D3CC] p-4 text-center">
        <p className="font-medium text-[#1E1E1E]">
          No supplier recommendations yet
        </p>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Recommendations will appear after product catalogs, supplier profiles, and buyer activity are available.
        </p>
      </div>
    </section>
  );
}
