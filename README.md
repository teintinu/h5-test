# h5-test

## usage:

npm install h5-test

## folders sample
```
+
- src
- test
  + features
    - f1.feature
    - f2.feature
  + steps
    - s1.js
  + template
    -  file1.js
    -  file2.js
    -  index.html
    -  check1.spec
    -  check2.spec
    -  run1.js
  - test.js

## escrever a integração em steps

```
module.exports = function (library, expect, h5_test) {
  .then('o processo atual será (.*)', function (curr_process, next) {
    h5_test.replace('___curr_process___', curr_process);
    h5_test.file('app/app.view.js');
    h5_test.file('app/welcome/welcome.js');
    h5_test.file('app/welcome/welcome.store.js');
    h5_test.file('app/p2/p2.view.js');
    h5_test.file('app/p2/p2.store.js');
    h5_test.serve('app/index.html');
    h5_test.pack('app', next);
    h5_test.wait('500ms');
    h5_test.check('test/app.store.spec');
    next();
  });
};
```

## comandos suportados em h5_test

### replace
Define variável para ser substituída nos arquivos
`h5_test.replace(variable, texto)`

### file
copia o arquivo da pasta template para pasta temp, executando substituições definidas pelo replace.
`h5_test.file('app/p2/p2.store.js');`
