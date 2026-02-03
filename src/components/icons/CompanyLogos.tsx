import { OpenAI, Anthropic, Google, Cursor } from "@lobehub/icons";
import Image from "next/image";

export const A16zLogo = ({ size = 24, className }: { size?: number; className?: string }) => (
  <Image
    src="/a16z.png"
    alt="a16z"
    width={size}
    height={size}
    className={`object-contain ${className || ""}`}
  />
);

export const COMPANY_LOGOS = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Google,
  cursor: Cursor,
  a16z: A16zLogo,
} as const;
