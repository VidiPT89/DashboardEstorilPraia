import Image from "next/image";

type TeamCrestProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
};

export function TeamCrest({ src, alt, size = 32, className = "" }: TeamCrestProps) {
  if (!src) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M12 2 4 5v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V5l-8-3Z" opacity="0.35" />
      </svg>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
