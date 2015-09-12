# Stack

The backend stack was chosen semi-arbitrarily to simply serve files. I threw in
express (overkill, kind of) to keep the work spent on this part short. Although
early commits may show I did a bit more work here before settling in after
integrating with webpack.

I tested everything with Node 4.0.0, it doesn't use ES6 features on the backend
so it should rely on it (and I removed the previously set requirement for Node
4.0.0) but mileage may vary.

**webpack** was used to compile and deliver ES6/JSX and Sass files in a single
deliverable.

**babel** was used to power ES6/JSX --> JS conversions.

**sass** used as a CSS preprocessor for variables and some color functions.

**react** used to drive component and UI creation (basic layout)

### Setup

Clone this repo and CD into the directory

```bash
git clone https://github.com/bbuck/calc 'bbuck_calc'
cd bbuck_calc
```

Install node, preferably v4.0.0. I recommend using `nvm`

```bash
nvm install 4.0.0
nvm use 4.0.0
```

Install dependencies

```bash
npm install -d
```

Install global components necessary

```bash
npm install -g webpack bower
```

Install front end dependencies

```bash
bower install
```

Finally you're ready to run the sever!

```bash
node server.js
# or
node .
# or from outside the directory
node bbuck_calc
```

Visit [localhost](http://localhost:3000) in your browser and view the calculator.
It should appear like the following:

![Sample image](https://github.com/bbuck/calc/raw/master/sample.png)
