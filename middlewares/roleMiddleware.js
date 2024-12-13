const jwt = require("jsonwebtoken");

const authorizeRole = (...allowedRoles)=>{
return (req,res,next)=>{
    const testToken = req.headers.authorization || req.headers.Authorization;

    let token;
    if (
      testToken ||
      testToken?.startsWith("Bearer") ||
      testToken?.startsWith("bearer")
    ) {
      token = testToken.split(" ")[1];
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if(!allowedRoles.includes(decodedToken.data.professionaltitle)){
        return res.status(403).send({message:'Access Denied'})
    }
    next()
}
}
module.exports = authorizeRole