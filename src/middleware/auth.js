import "dotenv/config";
import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Acesso Negado! Usuário não autorizado." });
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded;
    next();
  } catch (exception) {
    res.status(400).send("token inválido...");
  }
}

export { auth };

