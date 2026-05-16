export type { ServerStatusState, ServerData as ServerStatusServer } from "shared/types";

export type ServerStatusCardsProps = {
  title?: string;
  servers?: import("shared/types").ServerData[];
  className?: string;
};
