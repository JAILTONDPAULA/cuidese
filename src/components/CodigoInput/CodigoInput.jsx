import { useLayoutEffect, useRef } from 'react'
import './CodigoInput.scss'

// Código numérico em caixas separadas (ex.: 6 dígitos enviados por e-mail).
// O valor é uma string só de dígitos, preenchida em sequência, sem buracos.
// Usa o evento onChange (e não onKeyDown para os números) porque teclados virtuais
// do Android não informam a tecla digitada no keydown.
function CodigoInput({ tamanho = 6, valor = '', onChange, name, autoFocus = false, disabled = false }) {
	const refs = useRef([])
	const digitos = Array.from({ length: tamanho }, (_, i) => valor[i] ?? '')

	// Valor mais recente, atualizado na hora. O foco muda para a próxima caixa antes de o React
	// re-renderizar; sem isso, o handleFocus dela veria o valor antigo e devolveria o foco.
	const valorAtual = useRef(valor)
	useLayoutEffect(() => {
		valorAtual.current = valor
	}, [valor])

	function alterar(novo) {
		valorAtual.current = novo
		onChange?.(novo)
	}

	function focar(indice) {
		const alvo = refs.current[Math.max(0, Math.min(indice, tamanho - 1))]
		alvo?.focus()
	}

	function handleChange(event, indice) {
		const numeros = event.target.value.replace(/\D/g, '')

		// Apagou o conteúdo da caixa (ex.: recortar, ou backspace em alguns teclados)
		if (!numeros) {
			alterar(valor.slice(0, indice) + valor.slice(indice + 1))
			return
		}

		// 1 dígito: substitui a posição. Vários (colar, ou preenchimento automático do código): distribui a partir dela
		const novo = (valor.slice(0, indice) + numeros + valor.slice(indice + numeros.length)).slice(0, tamanho)
		alterar(novo)
		focar(indice + numeros.length)
	}

	function handleKeyDown(event, indice) {
		if (event.key === 'Backspace' && !digitos[indice] && indice > 0) {
			// Caixa vazia: apaga o dígito anterior e volta para ela
			event.preventDefault()
			alterar(valor.slice(0, indice - 1) + valor.slice(indice))
			focar(indice - 1)
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault()
			focar(indice - 1)
		} else if (event.key === 'ArrowRight' && digitos[indice]) {
			event.preventDefault()
			focar(indice + 1)
		}
	}

	// Mantém o preenchimento em sequência: não deixa focar uma caixa depois da primeira vazia.
	// Seleciona o conteúdo para o próximo dígito digitado substituir o atual.
	function handleFocus(event, indice) {
		const preenchidos = valorAtual.current.length
		if (indice > preenchidos) {
			focar(preenchidos)
			return
		}
		event.target.select()
	}

	return (
		<div className="codigo-input" style={{ '--codigo-tamanho': tamanho }}>
			{digitos.map((digito, indice) => (
				<input
					key={indice}
					ref={(el) => (refs.current[indice] = el)}
					type="text"
					inputMode="numeric"
					autoComplete={indice === 0 ? 'one-time-code' : 'off'}
					aria-label={`Dígito ${indice + 1} de ${tamanho}`}
					value={digito}
					autoFocus={autoFocus && indice === 0}
					disabled={disabled}
					onChange={(e) => handleChange(e, indice)}
					onKeyDown={(e) => handleKeyDown(e, indice)}
					onFocus={(e) => handleFocus(e, indice)}
				/>
			))}

			{/* Valor completo, para o FormData do form pai */}
			{name && <input type="hidden" name={name} value={valor} />}
		</div>
	)
}

export default CodigoInput
