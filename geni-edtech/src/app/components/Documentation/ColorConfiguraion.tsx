export const ColorConfiguration = () => {
  return (
    <>
      <h3 className=" text-xl font-semibold mt-8 text-black">Colors</h3>
      <div className="p-6 rounded-md border mt-4 border-dark_border border-opacity-60">
        <p className="text-base font-medium text-muted text-opacity-60">
          <span className="font-semibold text-lg text-black">
            1. Override Colors
          </span>{" "}
          <br />
          Tailwind CSS v4 theme colors are defined in src/app/globals.css:
        </p>
        <div className="py-4 px-5 rounded-md bg-black mt-8">
          <p className="text-sm text-white/60 flex flex-col gap-2">
            <span>--color-primary: #4d6bfe;</span>
            <span>--color-cream: #eef3ff;</span>
            <span>--color-success: #129c8b;</span>
            <span>--color-orange: #dce7ff;</span>
          </p>
        </div>
      </div>
      <div className="p-6 rounded-md border mt-4 border-dark_border border-opacity-60">
        <p className="text-base font-medium text-muted text-opacity-60">
          <span className="font-semibold text-lg text-black">
            2. Override Theme Colors
          </span>{" "}
          <br />
          Update the @theme block in src/app/globals.css:
        </p>
        <div className="py-4 px-5 rounded-md bg-black mt-8">
          <p className="text-sm text-white/60 flex flex-col gap-2">
            <span>--color-primary: #4d6bfe;</span>
          </p>
        </div>
      </div>
    </>
  );
};
