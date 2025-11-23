const nodeResolve=require('@rollup/plugin-node-resolve');
module.exports={
  input:'./app.js',
  output:{
    file:'dist/bundle.js',
    format:'es'    //es,cjs,umd,amd,iife
  },
  plugins:[nodeResolve()],
  external:['lodash-es']
}