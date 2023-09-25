## Persian Calendar Widget

Persian Calendar, the simple and stylish widget that will help you keep track of your days. With this widget you can see a beautiful and intuitive calendar in your notion pages.

## How to use

Create Embed with `/embed` command in your notion page and paste the link below.

Dark mode: [https://sajjadth.github.io/persian-calendar](https://sajjadth.github.io/persian-calendar) \
Light mode: [https://sajjadth.github.io/persian-calendar?theme=light](https://sajjadth.github.io/persian-calendar?theme=light)

## View Options

You can customize the calendar view by adding `?view=` followed by one of the following options:

- `month`
- `vertical-week`
- `horizontal-week`
- `day`

For example:

- [https://sajjadth.github.io/persian-calendar?view=month](https://sajjadth.github.io/persian-calendar?view=month)
- [https://sajjadth.github.io/persian-calendar?view=vertical-week](https://sajjadth.github.io/persian-calendar?view=vertical-week)
- [https://sajjadth.github.io/persian-calendar?view=horizontal-week](https://sajjadth.github.io/persian-calendar?view=horizontal-week)
- [https://sajjadth.github.io/persian-calendar?view=day](https://sajjadth.github.io/persian-calendar?view=day)

If no view option is provided, the default view will be set based on the selected theme.

You can also combine both theme and view by adding an `&` between them. For example:

- [https://sajjadth.github.io/persian-calendar?theme=light&view=month](https://sajjadth.github.io/persian-calendar?theme=light&view=month)
- [https://sajjadth.github.io/persian-calendar?theme=dark&view=horizontal-week](https://sajjadth.github.io/persian-calendar?theme=dark&view=horizontal-week)

## Auto Resize

The widget now automatically adjusts its size based on the width and height of your screen. If the dimensions are too small, an error message will be displayed, prompting you to increase the size of your screen.

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

```
npm install
```

```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

```
npm test
```

Launches the test runner in the interactive watch mode.

```
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed

## Credits

This software uses the following open source packages:

- [Persian Calendar API](https://github.com/sajjadth/persian-calendar-api)