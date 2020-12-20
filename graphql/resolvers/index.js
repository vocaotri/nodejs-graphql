const resolvers = require("require-all")({
  dirname: __dirname,
  filter: /(.+Resolver)\.js$/,
});
const moduleResolver = {};
Object.values(resolvers).forEach((resolver) => {
  Object.values(resolver).forEach((val)=>{
    const nameObj = val.name;
    moduleResolver[nameObj] = val
  })
});
module.exports = moduleResolver