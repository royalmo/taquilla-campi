# Taquilla-Campi - Instructions

When making changes to this repo, follow these guidelines:
- All literals must be in catalan, but all logs, inner files, code, inner documentation must be in english.
- Avoid one liner normalizer functions, especially for the backend. Create modularity whenever possible (e.g. each tab can be a directory and each part of the tab a file).
- The README will contain instructions on:
  - How to install dependencies.
  - How to run in dev mode.
  - How to build for production (and for each distro: Windows, Linux, ...).
  - Useful info: e.g. what files does it create, need, file formats, etc.
  The README will not contain usage or features documentation. If some is needed,
  put it as comments in the source files, no need to create /docs.
- Simplicity is the top 1 requirement. This is a simple app. No file should exceed 1k lines, if it does it must be separated in different modules, directories, or whatever needed.
- When assigned a task: (a) try to reuse as many components or methods as possible to remove duplicity, and (b) after looking at the code, if there are some parts where there could be multiple interpretations, or room for doubts, before proceeding you should ask me all these doubts. I prefer saying yes to all than to have to revert some changes.
