# Game Tracker

## Hey!

Recently, I finished up a course on React, and wanted to try out the knowledge and skills I picked up by creating a real, useful project. I decided to go with a game tracker, as it'll be useful to me. I've recently gotten into retro gaming, so I have a pretty large backlog that I'd like to be able to track. I think this accomplishes that pretty well.

This is the back-end, written with plain-old Node and Express. I chose Express for two reasons; it's super simple, and that's the framework I have the most experience with. As for using SQL instead of NoSQL, I've used MongoDB for most of my previous large projects, so I wanted to switch it up. As an added benefit, filtering is (in my opinion) less complicated in SQL than Mongo.

While most of the core functionality demanded by the front-end is fulfilled in this, there's definitely still some work that could be done. Like the front-end, I mostly need to refactor some stuff to make it prettier, but there's some functionality (specifically user accounts, so I can put it online) that I'd like to add. I'll be working on that over time.

---

## Reflections

It's been a while since I've built this app and, now that I've finished my AS in Computer Science, I've been reflecting on the tools I used for this app, and there are a few things I wish I did differently.

1. I should've used a database that was integrated into the application (specifically SQLite) rather than a MYSQL server. The approach that I went with, despite specifically being because I wanted to make a project with MySQL, isn't really applicable for this type of app; it creates a much bulkier implementation that requires multiple moving parts (React front end, Express back end, MySQL server) that goes against my intent of simplicity and usefulness.
2. Instead of an Express backend with a client-side focus, I either should've implemented accounts and published it (MySQL would've been fine then), or implement it with Electron.

Overall though, I had a great experience building this. It taught me a lot about React, which was the goal I had when starting the project.

---

If you'd like to, check out the front end as well, [over here](https://github.com/camdyn-dev/gametracker-react)!
