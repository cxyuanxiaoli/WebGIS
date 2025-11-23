# Postgresql

## JSON 处理

示例数据

<img src=".\img\image-20250402195815214.png" alt="image-20250402195815214" style="zoom:80%;" />

### 基本操作

PostgreSQL 默认提供了操作符用于查询json数据：

- The operator  `->` 按键返回 JSON 对象字段
- The operator  `->>` 以文本格式返回JSON对象字段
- The operator  `#>` 按指定路径返回JSON对象字段
- 操作符后若跟的是`integer`,则返回JSON数组对应索引元素,索引从0开始,-1代表最后一个元素

```sql
INSERT INTO test (info)
VALUES
   (
      '{ "customer": "Lily Bush", "items": {"product": "Diaper","qty": 24}}'
   ),
   (
      '{ "customer": "Josh William", "items": {"product": "Toy Car","qty": 1}}'
   ),
   (
      '{ "customer": "Mary Clark", "items": {"product": "Toy Train","qty": 2}}'
   );

select id,info->'items'->'product' from test;
select '[12,22,32]'::json->2

SELECT info ->> 'customer' AS customer FROM test
WHERE info -> 'items' ->> 'product' = 'Diaper'
select (info->'items'->>'qty')::integer from test
select '[{"id":1,"name":"zs"},{"id":2,"name":"ls"}]'::json->>-1

select info#>'{items}' from test
select info#>'{items,qty}' from test
select '{"data":[{"id":1,"num":10}]}'::json#>'{data,0,num}'
```

### 处理函数

* json_each(json)  将顶层JSON对象转为键值对形式

  ```sql
  SELECT json_each(info) FROM test
  ```

  | "(customer,""""""Lily Bush"""""")"<br/>"(items,""{""""product"""": """"Diaper"""",""""qty"""": 24}"")"<br/>"(customer,""""""Josh William"""""")"<br/>"(items,""{""""product"""": """"Toy Car"""",""""qty"""": 1}"")"<br/>"(customer,""""""Mary Clark"""""")"<br/>"(items,""{""""product"""": """"Toy Train"""",""""qty"""": 2}"")" |      |
  | ------------------------------------------------------------ | ---- |

* json_object_keys(json)  返回顶层JSON对象所有的键

  ```sql
  SELECT distinct json_object_keys (info) FROM test
  ```

  | "customer"<br/>"items" |      |
  | ---------------------- | ---- |

* json_typeof(json)  返回JSON对象的数据类型

  ```sql
  SELECT json_typeof(info->'customer') FROM test limit 1;
  ```

  | "string" |
  | -------- |

* row_to_json(row)  返回行记录的JSON对象形式

  ```sql
  -- 直接写表名称
  select row_to_json(test) from test limit 1
  ```

  | "{""id"":1,""info"":{ ""customer"": ""Lily Bush"", ""items"": {""product"": ""Diaper"",""qty"": 24}}}" |
  | ------------------------------------------------------------ |

  ```sql
  -- 通过row()构建行，返回特定字段  会丢失字段名称
  select row_to_json(row(id,info)) from test limit 1
  ```

  | "{""f1"":1,""f2"":{ ""customer"": ""Lily Bush"", ""items"": {""product"": ""Diaper"",""qty"": 24}}}" |
  | ------------------------------------------------------------ |

  ```sql
  -- 解决返回特定字段名称丢失问题，使用特定字段构建临时表
  select row_to_json(t)
  from (select id, info from test) AS t limit 1
  ```

  | "{""id"":1,""info"":{ ""customer"": ""Lily Bush"", ""items"": {""product"": ""Diaper"",""qty"": 24}}}" |
  | ------------------------------------------------------------ |

* array_agg()  聚合所有行为数组

  ```sql
  select array_agg(id) from test
  ```

  | {1,2,3} |
  | ------- |

  ```sql
  -- 将所有JSON行转为JSON[]
  select array_agg(row_to_json(t))
  from (select id, info from test) AS t
  ```

  | "{"<br>"{\""id\"":1,\""info\"":{ \""customer\"": \""Lily Bush\"", \""items\"": {\""product\"": \""Diaper\"",\""qty\"": 24}}}"",<br>""{\""id\"":2,\""info\"":{ \""customer\"": \""Josh William\"", \""items\"": {\""product\"": \""Toy Car\"",\""qty\"": 1}}}"",<br>""{\""id\"":3,\""info\"":{ \""customer\"": \""Mary Clark\"", \""items\"": {\""product\"": \""Toy Train\"",\""qty\"": 2}}}"<br>"}" |
  | ------------------------------------------------------------ |

* array_to_json()   将JSON[]格式的数据转换为JSON数组对象

  ```sql
  select array_to_json(array_agg(row_to_json(t)))
  from (select id, info from test) AS t
  ```

  | "[{""id"":1,""info"":{ ""customer"": ""Lily Bush"", ""items"": {""product"": ""Diaper"",""qty"": 24}}},{""id"":2,""info"":{ ""customer"": ""Josh William"", ""items"": {""product"": ""Toy Car"",""qty"": 1}}},{""id"":3,""info"":{ ""customer"": ""Mary Clark"", ""items"": {""product"": ""Toy Train"",""qty"": 2}}}]" |
  | ------------------------------------------------------------ |











