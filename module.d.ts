declare module "virtual:*" {
  const config: {
    owner: {
      did: string;
      sitename: string;
      description: string;
      url: string;
      avatar: string;
    };
    nodes: {
      requiredApiVersion: string;
      fallbackPublicExplorer: string;
      defaultHttpdPort: number;
      defaultLocalHttpdPort: number;
      defaultHttpdScheme: string;
    };
    source: {
      commitsPerPage: number;
    };
    deploymentId: string | null;
    reactions: string[];
    supportWebsite: string;
    preferredSeeds: BaseUrl[];
  };

  export default config;
}
