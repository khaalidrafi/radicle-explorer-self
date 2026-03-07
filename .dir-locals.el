((nil . (
         (eval .
               (defun radicle-explorer/npm-server ()
                 (interactive)
                 (khalid/project-run-async-shell-command "npm start" "*radicle-explorer-self-server*")))

         (eval .
               (defun radicle-explorer/deploy ()
                 (interactive)
                 (khalid/project-run-async-shell-command "npm run deploy" "*radicle-explorer-self-deploy*")))
         
         (khalid/project-commands . (radicle-explorer/npm-server))

         (khalid/project-deploy-command . radicle-explorer/deploy)
         (khalid/project-local-url . "http://localhost:3000")
         (eval .
               (khalid/set-project-command-keybindings)))))
