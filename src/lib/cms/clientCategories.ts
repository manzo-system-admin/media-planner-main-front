export type ClientCategory = "pr" | "ir" | "ipo";

export const CLIENT_CATEGORIES: { key: ClientCategory; label: string }[] = [
  { key: "pr", label: "PR/IR" },
  { key: "ipo", label: "IPO" },
];
