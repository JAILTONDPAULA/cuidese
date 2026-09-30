# HashHelper

Classe com métodos estáticos para gerar hashes. Não precisa instanciar (não use `new`).

O navegador não tem MD5 nativo (a Web Crypto API não oferece MD5), por isso o helper usa a biblioteca [`js-md5`](https://www.npmjs.com/package/js-md5). Se um dia a biblioteca for trocada, só este arquivo muda.

## Uso

```js
import HashHelper from '@/helpers/HashHelper/HashHelper'

HashHelper.md5('maria@exemplo.com')        // 'a39f08189b677316af877a4ddb2a1b90'
HashHelper.md5Email(' Maria@Exemplo.com ') // 'a39f08189b677316af877a4ddb2a1b90' (mesmo hash)
```

## Métodos

### `HashHelper.md5(texto)` → `string`

Retorna o MD5 do texto em hexadecimal minúsculo, com 32 caracteres. `null` e `undefined` viram texto vazio.

### `HashHelper.md5Email(email)` → `string`

Retorna o MD5 do e-mail **normalizado** (sem espaços nas pontas e em minúsculas), do mesmo jeito que o backend salva o e-mail (`mb_strtolower(trim($email))` no `UsuarioService`).

Use este método sempre que o hash for comparado com o e-mail salvo no banco. Sem a normalização, `Maria@Exemplo.com` e `maria@exemplo.com` gerariam hashes diferentes.

Hoje nenhuma tela usa o `md5Email`. O cadastro usava para montar `/confirmar?c=<hash>`, mas passou a usar o token devolvido pela API.

O `md5` é usado na tela de confirmação (`/confirmar`): o código de 6 dígitos digitado vai como `tokenB = md5(código)` na pré-validação do token.

## Cuidados

- **Não use MD5 para senha.** Ele é rápido de calcular, então é fácil de quebrar por força bruta. Senha vai em texto pelo HTTPS, e o backend faz o hash, porque o Laravel usa bcrypt ou argon.
- **O MD5 de um e-mail não é secreto.** Quem souber o e-mail consegue gerar o mesmo hash. Ele serve para **identificar**, não para autenticar. A prova de que a pessoa é dona do e-mail é o token de 6 dígitos.
