# mahjong
So we can play mahjong with friends during COVID-19

## how to run this game locally
Make sure you've pulled this repo and are in the ./server/ directory.

To start up the server:
```
npm run start
```
And you can go to localhost:8080 on any browser (except IE, some stuff isn't supported by IE) and check out the game. Using multiple incognito pages will let you play a game with multiple players.

To run in dev mode:
```
npm run dev
```
Whenever you make any file changes, the server will automatically restart in this mode, so it's convenient for debugging. It'd be good refresh your pages though, the server restarting means that all of your setup code will rerun.

Take a look at package.json to see the scripts or add scripts of your own.
