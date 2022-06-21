export const logger = (req, res, next) => {
  console.log(req.cookies);
  console.log(req.body);
  // console.log(req);
  next();
};
