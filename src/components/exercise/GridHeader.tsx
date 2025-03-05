export const GridHeader = ({titles}: {titles: string[]}) => {
  return (
    <>
      {titles.map((title, index) => (
        <span
          key={title + index}
          className="text-white text-center font-medium text-sm pb-1"
        >
          {title}
        </span>
      ))}
    </>
  );
};
