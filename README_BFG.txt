To resolve "Unable to access jarfile bfg.jar":

1. Download BFG Repo-Cleaner from:
   https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

2. Rename the downloaded file to `bfg.jar`.

3. Move `bfg.jar` to your project directory:
   c:\Users\cambl\Downloads\callsquare-main\callsquare-main

4. Run the command again:
   java -jar bfg.jar --delete-files video-conferencing.env

5. Then run:
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force

This will clean your git history and allow you to push to GitHub.

Troubleshooting "Unable to access jarfile bfg.jar":

- Make sure you have downloaded the file and named it exactly `bfg.jar` (not `bfg-1.14.0.jar`).
- Place `bfg.jar` directly in `c:\Users\cambl\Downloads\callsquare-main\callsquare-main`.
- In your terminal, run:
    dir bfg.jar
  to confirm the file exists in your current directory.

- If you see the file, run:
    java -jar bfg.jar --delete-files video-conferencing.env

- If you still get the error, check:
  - Java is installed (`java -version`)
  - You are in the correct directory (`pwd` or `cd` to your project folder)

If the problem persists, try running the command with the full path:
    java -jar c:\Users\cambl\Downloads\callsquare-main\callsquare-main\bfg.jar --delete-files video-conferencing.env

If you continue to have issues, consider deleting the repository and creating a new one, but only as a last resort.

If you still get "Unable to access jarfile bfg.jar":

- Double-check the file name is exactly `bfg.jar` (no extra extensions, no typos).
- Use `dir` in your terminal to confirm the file is present in your current directory.
- Make sure you are running the command from the same directory where `bfg.jar` is located.
- If you downloaded `bfg-1.15.0.jar`, rename it to `bfg.jar`:

    ren bfg-1.15.0.jar bfg.jar

  Or, run the command using the actual filename:

    java -jar bfg-1.15.0.jar --delete-files README_BFG.txt

If you still get "Unable to access jarfile", check:

- You are in the directory: `c:\Users\cambl\Downloads\callsquare-main\callsquare-main`
- Run `dir` and confirm `bfg-1.15.0.jar` is listed.
- Java is installed: `java -version`
- Use the correct filename in your command.

If your secret file is `README_BFG.txt`, use that filename in the BFG command.

Example full command:

    java -jar c:\Users\cambl\Downloads\callsquare-main\callsquare-main\bfg-1.15.0.jar --delete-files README_BFG.txt

If you want to delete `video-conferencing.env` instead, use:

    java -jar bfg-1.15.0.jar --delete-files video-conferencing.env

Always use the actual filename and extension in your command.

If you still encounter issues, please provide the output of:
    dir
    java -version
    java -jar bfg.jar --delete-files video-conferencing.env

for further troubleshooting.

If you do not have Java installed and want an easier way:

**Delete the repository and create a new one:**

1. On GitHub, delete the `video-conferencing` repository.
2. Locally, remove the `.git` folder:
   - In your project directory, run:
     ```
     rm -rf .git
     ```
     (On Windows, use `rmdir /s /q .git` in Command Prompt, or `Remove-Item -Recurse -Force .git` in PowerShell.)

3. Re-initialize git:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. Add your remote again:
   ```
   git remote add origin https://github.com/cambliss/video-conferencing.git
   ```

# If you see "error: remote origin already exists", you need to update the remote URL instead of adding a new one.

# To change the remote URL, run:
git remote set-url origin https://github.com/cambliss/call--video-cambliss.git

# Then push your code:
git push -u origin master

**Before you commit, make sure `.env` and any secret files are listed in `.gitignore`.**

This will start your repository fresh, with no secrets in history, and allow you to push to GitHub without errors.
