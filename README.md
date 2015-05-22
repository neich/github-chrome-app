# github-chrome-app


This is a simple app that shows how to integrate [React](https://facebook.github.io/react/) with [Mobile Chrome Apps](https://github.com/MobileChromeApps/mobile-chrome-apps). It also uses the [ratchet](http://goratchet.com/) framework.

##Dependencies

You need to install [Chrome Developer tools] (https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md). And it is highly recomended to also install the [Chrome App Developer Tool](https://github.com/MobileChromeApps/chrome-app-developer-tool/#installation)

##Setup the project

After cloning the repository:

```
cca create ./platform --android --link-to=app/manifest.json
npm install
```

## Run it

### In the browser

You can serve the project statically from your filesystem. I use [node-static](https://www.npmjs.com/package/node-static):

```
gulp
cd dist
static -p 8000
```

And you can try the app at localhost:8000

### With the Chrome App Dev Tool

You run the app dynamically in your device or emulator using:

```
cca push --target=192.168.56.101 --watch --dist
```

This example assumes that your device IP is 192.168.56.101 (this is what you'd normally get for [Genymotion](https://www.genymotion.com) emulator). The good things is that cca will watch any changes in your code, so every time you run gulp, the app will be updated automatically.

### Build the app and install it

Finally you just can buil the apk and install it and run it as a native app.

```
cd platforms
cca build android
```

At the end you'll have your apk file that you can install with ```adb install```





