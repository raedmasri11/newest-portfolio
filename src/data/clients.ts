import clientData from "./content/clients.json";

export type ClientKind = "creator" | "brand" | "agency";

export type PortfolioClient = {
  id: string;
  name: string;
  kind: ClientKind;
  image?: string;
  url?: string;
  showInHero?: boolean;
  showInMarquee?: boolean;
  published?: boolean;
  sortOrder?: number;
};

export const clients = (clientData as PortfolioClient[])
  .filter((client) => client.published !== false)
  .slice()
  .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));

export const heroClients = clients.filter((client) => client.showInHero && client.image);
export const marqueeClients = clients.filter((client) => client.showInMarquee);
