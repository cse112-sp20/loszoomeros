[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/codeclimate/codeclimate/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/test_coverage)](https://codeclimate.com/github/codeclimate/codeclimate/test_coverage)
# Zoomero
Due to the Covid-19 pandemic, everyone is forced to stay home. As a result, the line between work and life is getting blurry. While working we often find ourselves tempted by the siren calls of numerous entertainment resources available on the internet with no supervision. 
To help people tackle this problem, we created Zoomero, a productivity tool that denies access to certain websites and helps people easily enter work mode. It empowers the user to balance work and life.

<!-- ## Installation instructions
To install this Google Chrome extension, download and install Node.js [here](https://nodejs.org/en/). Once installed, open a termnial (PowerShell for Windows) and `cd` into the project directory. Run `npm install` and then `npm run build` to install all dependencies and build the extension, respectively. You can now load the extension into Chrome by navigating to Settings > Extensions > Load Unpacked, then selecting the `dist` folder. -->

## Developer Installation & Testing

##### How to Install
Download and install Node.js [here](https://nodejs.org/en/). Then, download the repository and install all the dependencies as instructed below 
```
git clone https://github.com/cse112-sp20/loszoomeros.git
cd loszoomeros
npm install
npm run build
```
If you decide to start fresh again,
```
rm -rf ./node_modules
git checkout -- .
git clean -dfx
```
You can now load the extension into Chrome by navigating to Settings > Extensions > Load Unpacked, then selecting the `dist` folder.
##### How to Test
```
npm run test
```

##### How to Generate Documentation
```
jsdoc -c conf.json -d ./docs
```
To view the generated documentation, go to your browser search bar and run

```
pathtorepo/docs/index.html
```
Then you can navigate through the JSDocs

##### How to Run Linting Test
```
npm run lint
```
##### If Linting Fails
```
npm run lint -- --fix
```

## Our Next Steps
https://docs.google.com/document/d/198OG2bzGY726-vLCi73P_fl3VgDZcOpSaaGg9Dfi2mY/edit

## Our Team Website With Contact Info
https://r6jackso.wixsite.com/website-1

## Credit

Acknowledgement to all of our team members who have contributed to this project.

## The Team
1. Ryan Jackson - **Lead**
2. Neel Chowdri - **Co-lead**
3. Daryl Nakamoto - **Coder**
4. Paul Larsen - **Coder**
5. Erik Follette - **Build**
6. Yan Sun - **Build**
7. Saikrishna Chandhrasekhar - **Build**
8. Hansae Lee - **Quality Assurance**
9. Elizabeth Cho - **Quality Assurance**
10. Yuchen Zhang - **User Interface**
11. Edvard Mattias Boe - **User Interface**
12. Tim Ferido - **User Interface**



> Names are sorted in alphabetic order within each category of team roles.
