import jwt from "jsonwebtoken";

async function doLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "ana.tpc2022@gmail.com" && password === "Lanna0210") {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRES),
    });

    return res.json({
      id: 1,
      token,
    });
  }

  res.sendStatus(401);
}

const blacklist = {};

async function doLogout(req, res, next) {
  const token = req.headers["authorization"];
  blacklist[token] = true;

  setTimeout(
    () => (blacklist[token] = undefined),
    parseInt(process.env.JWT_EXPIRES) * 1000
  );

  return res.sendStatus(200);
}

function isBlacklisted(token) {
  return blacklist[token];
}

export default {
  doLogin,
  doLogout,
  isBlacklisted,
};
