## JWT登录校验

1. 安装jwt : npm i jsonwebtoken

2. 引入：const jwt = require("jsonwebtoken")

3. 在用户登录成功后生成token并返回给请求端

   ```js
   //生成token
   const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
   //返回token
   res.json(
     ResFormat.success(
       { id: user.id, name: user.username, token: token },
       "login success"
     )
   );
   ```

   1. **`jwt.sign` 方法**:
      - `jwt.sign` 是 `jsonwebtoken` 库中的一个方法，用于生成一个JWT。
   2. **参数**:
      - `{ id: user.id }`: 这是JWT的载荷（payload），包含了要存储在JWT中的信息。在这个例子中，载荷包含了用户的ID。
      - `JWT_SECRET`: 这是用于对JWT进行签名的密钥。密钥必须保密，因为任何拥有该密钥的人都可以生成有效的JWT，从而冒充用户。
      - `{ expiresIn: "1h" }`: 这是JWT的选项（options），其中 `expiresIn` 指定了JWT的有效期。在这个例子中，JWT将在生成后1小时内过期。
   3. **返回值**:
      - `jwt.sign` 方法会返回一个字符串，这个字符串就是JWT。生成的JWT可以被发送给客户端，并在后续的请求中被客户端用来证明其身份。

4. 在需要检验的接口中使用token检验中间件

   ```js
   //登录校验中间件-放在需要进行登录校验的其他接口前
   router.use((req, res, next) => {
     //获取 ‘Bearer <token>’ 字符串
     const authHeader = req.headers["authorization"];
     //获取token
     const token = authHeader && authHeader.split(" ")[1];
     //token不存在
     if (!token) {
       return res.sendStatus(401);
     }
     //token校验
     jwt.verify(token, JWT_SECRET, (err, user) => {
       if (err) {
         //token无效
         return res.sendStatus(403);
       }
       //token校验成功，将用户id存入req对象
       req.user = user;
       next();
     });
   });
   ```

   - 使用`jwt.verify`方法来验证Token的有效性。该方法接收三个参数：要验证的Token、用于解密Token的密钥（在这个例子中是`JWT_SECRET`），以及一个回调函数。
   - 回调函数接收两个参数：`err`（验证过程中可能发生的错误）、`user`（如果Token有效，此参数包含解码后的用户信息）。
   - 如果验证过程中发生错误（即`err`不是`null`或`undefined`），则返回状态码403（禁止访问），表示提供的Token无效或已过期。
   - 如果Token验证成功，将解码后的用户信息（在这个例子中主要是用户ID）存入`req`对象的`user`属性中。这样后续的路由处理函数就可以通过`req.user`获取到当前登录用户的ID。
   - 最后调用`next()`方法，将请求对象和响应对象传递给下一个中间件或路由处理函数。

