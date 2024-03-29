export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-[70px] lg:h-[90px] w-full bg-indigo-300 text-center rounded-lg "
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="flex justify-center items-center h-[70px] lg:h-[90px] w-full bg-indigo-500 text-white rounded-lg p-1">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="flex items-center justify-center h-[70px] lg:h-[90px] bg-transparent rounded-lg w-full text-indigo-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
