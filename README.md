
```javascript
var h5_test=require('h5-test');

new h5_test(__dirname+'/..', 'Portuguese');
```

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
```  

## escrever a integração em steps

```javascript
module.exports = function (library, expect, h5_test) {
  .then('o processo atual será (.*)', function (curr_process, next) {
    h5_test.replace('___curr_process___', curr_process);
    h5_test.file('app/app.view.js');
    h5_test.file('app/welcome/welcome.js');
    h5_test.file('app/welcome/welcome.store.js');
    h5_test.file('app/p2/p2.view.js');
    h5_test.file('app/p2/p2.store.js');
    h5_test.serve('app/index.html');
    h5_test.wait('500ms');
    h5_test.check('test/app.store.spec');
    h5_test.pack('app', next);
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

### serve
copia o arquivo da pasta template para pasta temp, executando substituições definidas pelo replace e coloca esse arquivo como o index do teste.

`h5_test.file('app/p2/p2.store.js');`

### pack
copia o arquivo webpack.config.js da subpasta informada na pasta template para pasta temp, executando substituições definidas pelo replace e chama o webpack na .

`h5_test.pack('app', next);`
> é um comando assíncrono, deve ser o último no step

### check
copia o arquivo da pasta template para pasta temp, executando substituições definidas pelo replace e coloca esse arquivo para que o galen execute o comando CHECK nele

`h5_test.check('test/app.store.spec');`

### run
copia o arquivo da pasta template para pasta temp, executando substituições definidas pelo replace e coloca esse arquivo para que o galen execute o comando RUN nele. pode passar argumentos.

`h5_test.run('test/r1.js');`

`h5_test.run('test/login.js', {user: 'admin', pwd: '123'});`

> o script será executado com as globais: arg, driver

### wait
programa uma pausa na executação dos testes
a unidade pode ser em ms ou s
`h5_test.wait('200ms')`
pode-se especificar condições para encerrar o timeout
`h5_test.wait('200ms until exist "css: div.list a"')`

### open
programa a mudança de url na execução de testes
`h5_test.open('http://host/page.html')`

### resize
programa a mudança do tamanho da janela do navegador durante a execução dos testes 
`h5_test.resize('1024x768')`

### inject
programa a inserção de um script na página
`h5_test.inject('arq.js')`

### dump
programa a criação de um arquivo com o SPEC atual da página.
`h5_test.dump('temp.spec')`
> o arquivo é criado na pasta temp 
