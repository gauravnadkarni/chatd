import clsx, { ClassValue } from "clsx";

interface SpinnerProps {
  children?: React.ReactNode;
  classValues?: ClassValue;
  centerAligned?: boolean;
}

export default function Spinner({ classValues, centerAligned }: SpinnerProps) {
  const classes = classValues || "h-12 w-12";
  const spinner = (
    <div
      className={clsx(
        "animate-spin rounded-full border-t-2 border-b-2 border-blue-500",
        classes
      )}
    ></div>
  );

  return centerAligned ? (
    <div className="flex items-center justify-center">{spinner}</div>
  ) : (
    spinner
  );
}
