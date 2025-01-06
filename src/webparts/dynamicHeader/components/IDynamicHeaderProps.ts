import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDynamicHeaderProps {
  Title: string;
  userDisplayName: string;
  context: WebPartContext;
}
