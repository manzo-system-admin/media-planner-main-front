import type { ReactNode } from "react";

export default function ContentSheet({ children }: { children: ReactNode }) {
  return <div className="contentSheet">{children}</div>;
}
