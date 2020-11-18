const app = require("./src/app");

const port = process.env.PORT || 4333;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));