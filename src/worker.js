// Auto-generated Worker: Serves Radicle Explorer UI + Git proxy
const REPO_MAP = 
{
  "khalids-shell": "rad:zZu6zho3STEy7yVtjg8ejUNkKfXM",
  "git-issues-tracker": "rad:z22jmJPXDicA73ujyKDvK2ZZjD2tR",
  "kshell": "rad:z2GSvbDuW2Csc7VuMzXp6Kw4KLNex",
  ".emacs.d": "rad:z2fZ8AGEsuVPTLPkB575jNA6xYvrX",
  "radicle-explorer-self": "rad:z3wSfGTKhTTx4p4R4dSUFtiWAHp7p",
  "job-tracker": "rad:z43RGurg9b2w9tzHSERdMPVSNup29",
  "emacs-eat": "rad:z43axGh2tyE5dAixXwXY4ctEJezj9"
}
;

const SEED_URL = "https://rosa.radicle.xyz";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    console.log("Request path:", path);
    
    // Git proxy: Match pattern /repo-name.git/... or /repo-name.git
    const gitMatch = path.match(/^\/([^\/]+)\.git(\/.*)?$/);
    
    if (gitMatch) {
      const [, repoName, subPath = ''] = gitMatch;
      console.log("Git match found:", repoName, "subPath:", subPath);
      console.log("Available repos:", Object.keys(REPO_MAP));
      
      const rid = REPO_MAP[repoName];
      
      if (!rid) {
        console.log("Repository not found:", repoName);
        return new Response(`Repository '${repoName}' not found\n\nAvailable repos:\n${Object.keys(REPO_MAP).map(k => `- ${k}.git`).join('\n')}`, { 
          status: 404,
          headers: { "Content-Type": "text/plain" }
        });
      }
      
      // Remove 'rad:' prefix and construct target URL
      const ridClean = rid.replace(/^rad:/, '');
      const targetUrl = `${SEED_URL}/${ridClean}.git${subPath}`;
      
      console.log(`Proxying ${repoName}.git -> ${targetUrl}`);
      
      // Proxy to Radicle seed
      return fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
    }
    
    // Otherwise, serve static assets (Explorer UI)
    return env.ASSETS.fetch(request);
  }
};
