export const TypographyConfiguration = () => {
  return (
    <>
      <h3 className="text-xl font-semibold mt-8 text-black">Typography</h3>
      <div className="p-6 rounded-md border mt-4 border-dark_border border-opacity-60">
        <p className="text-base font-medium text-muted text-opacity-60">
          1. Change the local system font stack in:{" "}
          <span className="font-semibold text-base">src/app/globals.css</span>{" "}
        </p>
        <div className="py-4 px-3 rounded-md bg-black mt-8">
          <p className="text-sm text-white/60 flex flex-col gap-2 mb-3">
            {`font-family: Inter, "PingFang SC", "Microsoft YaHei",`}
            <br />
            {`  "Noto Sans CJK SC", system-ui, sans-serif;`}
          </p>
        </div>
      </div>
    </>
  );
};
