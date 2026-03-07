declare module "virtual:*" {
  const config: {
    user: {
      did: string;
      sitename: string;
      description: string;
      url: string;
      avatar: string;
      defaultNode: {
        hostname: string;
        port: number;
        scheme: string;
      };
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
