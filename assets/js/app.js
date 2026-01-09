/** app.js
 *
 * Entry for bundling by webpack.
 */

/* global hljs */

/** @see https://alpinejs.dev */
import Alpine from 'alpinejs'

/** @see https://alpinejs.dev/plugins/intersect */
import intersect from '@alpinejs/intersect'

Alpine.plugin(intersect)

/** @see https://alpinejs.dev/plugins/collapse */
import collapse from '@alpinejs/collapse'

Alpine.plugin(collapse)

window.Alpine = Alpine

// highlight.js 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (typeof hljs !== 'undefined') {
        // 모든 코드 블록에 Google-style header 추가
        document.querySelectorAll('pre code').forEach((codeBlock) => {
            const pre = codeBlock.parentElement
            if (pre && !pre.parentElement.classList.contains('code-block-wrapper')) {
                // Trim code content
                const originalCode = (codeBlock.textContent || '').trim()
                codeBlock.textContent = originalCode

                // 언어 감지
                let language = 'text'
                const langClass = Array.from(codeBlock.classList).find(c => c.startsWith('language-'))
                if (langClass) {
                    language = langClass.replace('language-', '')
                } else {
                    const dataLang = pre.dataset.keLanguage || codeBlock.dataset.keLanguage
                    if (dataLang) {
                        language = dataLang
                    } else {
                        const validClasses = Array.from(codeBlock.classList).filter(c => c !== 'hljs')
                        if (validClasses.length > 0) language = validClasses[0]
                    }
                }

                // Wrapper & Header 생성
                const wrapper = document.createElement('div')
                wrapper.className = 'code-block-wrapper'

                const header = document.createElement('div')
                header.className = 'code-header'

                // 언어 표시
                const langLabel = document.createElement('span')
                langLabel.className = 'code-language'
                langLabel.textContent = language.toUpperCase()
                header.appendChild(langLabel)

                // Copy Button
                const copyBtn = document.createElement('button')
                copyBtn.className = 'code-copy-button'
                copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
                copyBtn.setAttribute('aria-label', '코드 복사')
                copyBtn.onclick = async () => {
                    await navigator.clipboard.writeText(originalCode)
                    copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                    setTimeout(() => {
                        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
                    }, 2000)
                }

                header.appendChild(copyBtn)
                wrapper.appendChild(header)

                // Pre element 이동
                pre.parentNode.insertBefore(wrapper, pre)
                wrapper.appendChild(pre)

                // hljs 하이라이팅
                hljs.highlightAll()
            }
        })
    }
})

Alpine.start()
