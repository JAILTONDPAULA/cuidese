# SenhaInput

Campo de senha com um botão de olho, dentro do próprio campo, que alterna entre esconder (`password`) e mostrar (`text`) o que foi digitado.

## Uso

```jsx
import SenhaInput from '@/components/SenhaInput/SenhaInput'

<label className="field">
	<span className="field__label">Senha</span>
	<SenhaInput name="senha" autoComplete="new-password" placeholder="Crie uma senha" required />
	<small className="field__erro">Informe uma senha</small>
</label>
```

## Props

Todas as props são repassadas para o `<input>`, **exceto `type`**, que é controlado pelo botão. Funcionam as mesmas de um input comum: `name`, `value`, `onChange`, `placeholder`, `required`, `minLength`, `pattern`, `autoComplete`, `disabled`, `onBlur` etc.

Não há props próprias.

## Comportamento

- Começa escondido (`password`), com o ícone de olho (`faEye`).
- Ao clicar no botão, mostra o texto, e o ícone vira o olho cortado (`faEyeSlash`). Clicando de novo, esconde.
- Cada campo alterna de forma independente.
- O botão tem `aria-label` ("Mostrar senha" ou "Ocultar senha") e `aria-pressed`, para leitores de tela.

## Cuidados

- Use dentro de um `.field`, como no exemplo, para herdar o visual padrão dos campos, incluindo erro e `:user-invalid`.
- Use `autoComplete="new-password"` ao criar ou trocar a senha, e `"current-password"` no login. Assim, o gerenciador de senhas do navegador sugere ou preenche corretamente.
- O botão é `type="button"`, então não envia o form.
